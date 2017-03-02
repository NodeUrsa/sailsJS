define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    'use strict';

    var Marionette = window.Marionette = {};

    // Helpers
    // -------

    // For slicing `arguments` in functions
    var slice = Array.prototype.slice;

    function throwError(message, name) {
        var error = new Error(message);
        error.name = name || 'Error';
        throw error;
    }

    // Marionette.extend
    // -----------------

    // Borrow the Backbone `extend` method so we can use it as needed
    Marionette.extend = Backbone.Model.extend;

    // Marionette.getOption
    // --------------------

    // Retrieve an object, function or other value from a target
    // object or its `options`, with `options` taking precedence.
    Marionette.getOption = function(target, optionName){
        if (!target || !optionName){ return; }
        var value;

        if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)){
            value = target.options[optionName];
        } else {
            value = target[optionName];
        }

        return value;
    };

    // Marionette.normalizeMethods
    // ----------------------

    // Pass in a mapping of events => functions or function names
    // and return a mapping of events => functions
    Marionette.normalizeMethods = function(hash) {
        var normalizedHash = {}, method;
        _.each(hash, function(fn, name) {
            method = fn;
            if (!_.isFunction(method)) {
                method = this[method];
            }
            if (!method) {
                return;
            }
            normalizedHash[name] = method;
        }, this);
        return normalizedHash;
    };


    // allows for the use of the @ui. syntax within
    // a given key for triggers and events
    // swaps the @ui with the associated selector
    Marionette.normalizeUIKeys = function(hash, ui) {
        if (typeof(hash) === "undefined") {
            return;
        }

        _.each(_.keys(hash), function(v) {
            var pattern = /@ui.[a-zA-Z_$0-9]*/g;
            if (v.match(pattern)) {
                hash[v.replace(pattern, function(r) {
                    return ui[r.slice(4)];
                })] = hash[v];
                delete hash[v];
            }
        });

        return hash;
    };

    // Mix in methods from Underscore, for iteration, and other
    // collection related features.
    // Borrowing this code from Backbone.Collection:
    // http://backbonejs.org/docs/backbone.html#section-106
    Marionette.actAsCollection = function(object, listProperty) {
        var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
            'select', 'reject', 'every', 'all', 'some', 'any', 'include',
            'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
            'last', 'without', 'isEmpty', 'pluck'];

        _.each(methods, function(method) {
            object[method] = function() {
                var list = _.values(_.result(this, listProperty));
                var args = [list].concat(_.toArray(arguments));
                return _[method].apply(_, args);
            };
        });
    };

    // Marionette.View
    // ---------------

    // The core view type that other Marionette views extend from.
    Marionette.View = Backbone.View.extend({

        constructor: function(options){
            _.bindAll(this, "render");

            // this exposes view options to the view initializer
            // this is a backfill since backbone removed the assignment
            // of this.options
            // at some point however this may be removed
            this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);

            // parses out the @ui DSL for events
            this.events = this.normalizeUIKeys(_.result(this, 'events'));

            if (_.isObject(this.behaviors)) {
                new Marionette.Behaviors(this);
            }

            Backbone.View.prototype.constructor.apply(this, arguments);

            Marionette.MonitorDOMRefresh(this);
            this.listenTo(this, "show", this.onShowCalled);
        },

        // import the "triggerMethod" to trigger events with corresponding
        // methods if the method exists
        triggerMethod: Marionette.triggerMethod,

        // Imports the "normalizeMethods" to transform hashes of
        // events=>function references/names to a hash of events=>function references
        normalizeMethods: Marionette.normalizeMethods,

        // Get the template for this view
        // instance. You can set a `template` attribute in the view
        // definition or pass a `template: "whatever"` parameter in
        // to the constructor options.
        getTemplate: function(){
            return Marionette.getOption(this, "template");
        },

        // Mix in template helper methods. Looks for a
        // `templateHelpers` attribute, which can either be an
        // object literal, or a function that returns an object
        // literal. All methods and attributes from this object
        // are copies to the object passed in.
        mixinTemplateHelpers: function(target){
            target = target || {};
            var templateHelpers = Marionette.getOption(this, "templateHelpers");
            if (_.isFunction(templateHelpers)){
                templateHelpers = templateHelpers.call(this);
            }
            return _.extend(target, templateHelpers);
        },


        normalizeUIKeys: function(hash) {
            var ui = _.result(this, 'ui');
            return Marionette.normalizeUIKeys(hash, ui);
        },

        // Configure `triggers` to forward DOM events to view
        // events. `triggers: {"click .foo": "do:foo"}`
        configureTriggers: function(){
            if (!this.triggers) { return; }

            var triggerEvents = {};

            // Allow `triggers` to be configured as a function
            var triggers = this.normalizeUIKeys(_.result(this, "triggers"));

            // Configure the triggers, prevent default
            // action and stop propagation of DOM events
            _.each(triggers, function(value, key){

                var hasOptions = _.isObject(value);
                var eventName = hasOptions ? value.event : value;

                // build the event handler function for the DOM event
                triggerEvents[key] = function(e){

                    // stop the event in its tracks
                    if (e) {
                        var prevent = e.preventDefault;
                        var stop = e.stopPropagation;

                        var shouldPrevent = hasOptions ? value.preventDefault : prevent;
                        var shouldStop = hasOptions ? value.stopPropagation : stop;

                        if (shouldPrevent && prevent) { prevent.apply(e); }
                        if (shouldStop && stop) { stop.apply(e); }
                    }

                    // build the args for the event
                    var args = {
                        view: this,
                        model: this.model,
                        collection: this.collection
                    };

                    // trigger the event
                    this.triggerMethod(eventName, args);
                };

            }, this);

            return triggerEvents;
        },

        // Overriding Backbone.View's delegateEvents to handle
        // the `triggers`, `modelEvents`, and `collectionEvents` configuration
        delegateEvents: function(events){
            this._delegateDOMEvents(events);
            Marionette.bindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
            Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
        },

        // internal method to delegate DOM events and triggers
        _delegateDOMEvents: function(events){
            events = events || this.events;
            if (_.isFunction(events)){ events = events.call(this); }

            var combinedEvents = {};

            // look up if this view has behavior events
            var behaviorEvents = _.result(this, 'behaviorEvents') || {};
            var triggers = this.configureTriggers();

            // behavior events will be overriden by view events and or triggers
            _.extend(combinedEvents, behaviorEvents, events, triggers);

            Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
        },

        // Overriding Backbone.View's undelegateEvents to handle unbinding
        // the `triggers`, `modelEvents`, and `collectionEvents` config
        undelegateEvents: function(){
            var args = Array.prototype.slice.call(arguments);
            Backbone.View.prototype.undelegateEvents.apply(this, args);

            Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
            Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
        },

        // Internal method, handles the `show` event.
        onShowCalled: function(){},

        // Default `close` implementation, for removing a view from the
        // DOM and unbinding it. Regions will call this method
        // for you. You can specify an `onClose` method in your view to
        // add custom code that is called after the view is closed.
        close: function(){
            if (this.isClosed) { return; }

            var args = Array.prototype.slice.call(arguments);

            // allow the close to be stopped by returning `false`
            // from the `onBeforeClose` method
            var shouldClose = this.triggerMethod.apply(this, ["before:close"].concat(args));
            if (shouldClose === false){
                return;
            }

            // mark as closed before doing the actual close, to
            // prevent infinite loops within "close" event handlers
            // that are trying to close other views
            this.isClosed = true;
            this.triggerMethod.apply(this, ["close"].concat(args));

            // unbind UI elements
            this.unbindUIElements();

            // remove the view from the DOM
            this.remove();
        },

        // This method binds the elements specified in the "ui" hash inside the view's code with
        // the associated jQuery selectors.
        bindUIElements: function(){
            if (!this.ui) { return; }

            // store the ui hash in _uiBindings so they can be reset later
            // and so re-rendering the view will be able to find the bindings
            if (!this._uiBindings){
                this._uiBindings = this.ui;
            }

            // get the bindings result, as a function or otherwise
            var bindings = _.result(this, "_uiBindings");

            // empty the ui so we don't have anything to start with
            this.ui = {};

            // bind each of the selectors
            _.each(_.keys(bindings), function(key) {
                var selector = bindings[key];
                this.ui[key] = this.$(selector);
            }, this);
        },

        // This method unbinds the elements specified in the "ui" hash
        unbindUIElements: function(){
            if (!this.ui || !this._uiBindings){ return; }

            // delete all of the existing ui bindings
            _.each(this.ui, function($el, name){
                delete this.ui[name];
            }, this);

            // reset the ui element to the original bindings configuration
            this.ui = this._uiBindings;
            delete this._uiBindings;
        }
    });

    // Collection View
    // ---------------

    // A view that iterates over a Backbone.Collection
    // and renders an individual ItemView for each model.
    Marionette.CollectionView = Marionette.View.extend({
        // used as the prefix for item view events
        // that are forwarded through the collectionview
        itemViewEventPrefix: "itemview",

        // constructor
        constructor: function(options){
            this._initChildViewStorage();

            Marionette.View.prototype.constructor.apply(this, arguments);

            this._initialEvents();
            this.initRenderBuffer();
        },

        // Instead of inserting elements one by one into the page,
        // it's much more performant to insert elements into a document
        // fragment and then insert that document fragment into the page
        initRenderBuffer: function() {
            this.elBuffer = document.createDocumentFragment();
            this._bufferedChildren = [];
        },

        startBuffering: function() {
            this.initRenderBuffer();
            this.isBuffering = true;
        },

        endBuffering: function() {
            this.isBuffering = false;
            this.appendBuffer(this, this.elBuffer);
            this._triggerShowBufferedChildren();
            this.initRenderBuffer();
        },

        _triggerShowBufferedChildren: function () {
            if (this._isShown) {
                _.each(this._bufferedChildren, function (child) {
                    Marionette.triggerMethod.call(child, "show");
                });
                this._bufferedChildren = [];
            }
        },

        // Configured the initial events that the collection view
        // binds to.
        _initialEvents: function(){
            if (this.collection){
                this.listenTo(this.collection, "add", this.addChildView);
                this.listenTo(this.collection, "remove", this.removeItemView);
                this.listenTo(this.collection, "reset", this.render);
            }
        },

        // Handle a child item added to the collection
        addChildView: function(item, collection, options){
            this.closeEmptyView();
            var ItemView = this.getItemView(item);
            var index = this.collection.indexOf(item);
            this.addItemView(item, ItemView, index);
        },

        // Override from `Marionette.View` to guarantee the `onShow` method
        // of child views is called.
        onShowCalled: function(){
            this.children.each(function(child){
                Marionette.triggerMethod.call(child, "show");
            });
        },

        // Internal method to trigger the before render callbacks
        // and events
        triggerBeforeRender: function(){
            this.triggerMethod("before:render", this);
            this.triggerMethod("collection:before:render", this);
        },

        // Internal method to trigger the rendered callbacks and
        // events
        triggerRendered: function(){
            this.triggerMethod("render", this);
            this.triggerMethod("collection:rendered", this);
        },

        // Render the collection of items. Override this method to
        // provide your own implementation of a render function for
        // the collection view.
        render: function(){
            this.isClosed = false;
            this.triggerBeforeRender();
            this._renderChildren();
            this.triggerRendered();
            return this;
        },

        // Internal method. Separated so that CompositeView can have
        // more control over events being triggered, around the rendering
        // process
        _renderChildren: function(){
            this.startBuffering();

            this.closeEmptyView();
            this.closeChildren();

            if (!this.isEmpty(this.collection)) {
                this.showCollection();
            } else {
                this.showEmptyView();
            }

            this.endBuffering();
        },

        // Internal method to loop through each item in the
        // collection view and show it
        showCollection: function(){
            var ItemView;
            this.collection.each(function(item, index){
                ItemView = this.getItemView(item);
                this.addItemView(item, ItemView, index);
            }, this);
        },

        // Internal method to show an empty view in place of
        // a collection of item views, when the collection is
        // empty
        showEmptyView: function(){
            var EmptyView = this.getEmptyView();

            if (EmptyView && !this._showingEmptyView){
                this._showingEmptyView = true;
                var model = new Backbone.Model();
                this.addItemView(model, EmptyView, 0);
            }
        },

        // Internal method to close an existing emptyView instance
        // if one exists. Called when a collection view has been
        // rendered empty, and then an item is added to the collection.
        closeEmptyView: function(){
            if (this._showingEmptyView){
                this.closeChildren();
                delete this._showingEmptyView;
            }
        },

        // Retrieve the empty view type
        getEmptyView: function(){
            return Marionette.getOption(this, "emptyView");
        },

        // Retrieve the itemView type, either from `this.options.itemView`
        // or from the `itemView` in the object definition. The "options"
        // takes precedence.
        getItemView: function(item){
            var itemView = Marionette.getOption(this, "itemView");

            if (!itemView){
                throwError("An `itemView` must be specified", "NoItemViewError");
            }

            return itemView;
        },

        // Render the child item's view and add it to the
        // HTML for the collection view.
        addItemView: function(item, ItemView, index){
            // get the itemViewOptions if any were specified
            var itemViewOptions = Marionette.getOption(this, "itemViewOptions");
            if (_.isFunction(itemViewOptions)){
                itemViewOptions = itemViewOptions.call(this, item, index);
            }

            // build the view
            var view = this.buildItemView(item, ItemView, itemViewOptions);

            // set up the child view event forwarding
            this.addChildViewEventForwarding(view);

            // this view is about to be added
            this.triggerMethod("before:item:added", view);

            // Store the child view itself so we can properly
            // remove and/or close it later
            this.children.add(view);

            // Render it and show it
            this.renderItemView(view, index);

            // call the "show" method if the collection view
            // has already been shown
            if (this._isShown && !this.isBuffering){
                Marionette.triggerMethod.call(view, "show");
            }

            // this view was added
            this.triggerMethod("after:item:added", view);

            return view;
        },

        // Set up the child view event forwarding. Uses an "itemview:"
        // prefix in front of all forwarded events.
        addChildViewEventForwarding: function(view){
            var prefix = Marionette.getOption(this, "itemViewEventPrefix");

            // Forward all child item view events through the parent,
            // prepending "itemview:" to the event name
            this.listenTo(view, "all", function(){
                var args = slice.call(arguments);
                var rootEvent = args[0];
                var itemEvents = this.normalizeMethods(this.getItemEvents());

                args[0] = prefix + ":" + rootEvent;
                args.splice(1, 0, view);

                // call collectionView itemEvent if defined
                if (typeof itemEvents !== "undefined" && _.isFunction(itemEvents[rootEvent])) {
                    itemEvents[rootEvent].apply(this, args);
                }

                Marionette.triggerMethod.apply(this, args);
            }, this);
        },

        // returns the value of itemEvents depending on if a function
        getItemEvents: function() {
            if (_.isFunction(this.itemEvents)) {
                return this.itemEvents.call(this);
            }

            return this.itemEvents;
        },

        // render the item view
        renderItemView: function(view, index) {
            view.render();
            this.appendHtml(this, view, index);
        },

        // Build an `itemView` for every model in the collection.
        buildItemView: function(item, ItemViewType, itemViewOptions){
            var options = _.extend({model: item}, itemViewOptions);
            return new ItemViewType(options);
        },

        // get the child view by item it holds, and remove it
        removeItemView: function(item){
            var view = this.children.findByModel(item);
            this.removeChildView(view);
            this.checkEmpty();
        },

        // Remove the child view and close it
        removeChildView: function(view){

            // shut down the child view properly,
            // including events that the collection has from it
            if (view){
                // call 'close' or 'remove', depending on which is found
                if (view.close) { view.close(); }
                else if (view.remove) { view.remove(); }

                this.stopListening(view);
                this.children.remove(view);
            }

            this.triggerMethod("item:removed", view);
        },

        // helper to check if the collection is empty
        isEmpty: function(collection){
            // check if we're empty now
            return !this.collection || this.collection.length === 0;
        },

        // If empty, show the empty view
        checkEmpty: function (){
            if (this.isEmpty(this.collection)){
                this.showEmptyView();
            }
        },

        // You might need to override this if you've overridden appendHtml
        appendBuffer: function(collectionView, buffer) {
            collectionView.$el.append(buffer);
        },

        // Append the HTML to the collection's `el`.
        // Override this method to do something other
        // than `.append`.
        appendHtml: function(collectionView, itemView, index){
            if (collectionView.isBuffering) {
                // buffering happens on reset events and initial renders
                // in order to reduce the number of inserts into the
                // document, which are expensive.
                collectionView.elBuffer.appendChild(itemView.el);
                collectionView._bufferedChildren.push(itemView);
            }
            else {
                // If we've already rendered the main collection, just
                // append the new items directly into the element.
                collectionView.$el.append(itemView.el);
            }
        },

        // Internal method to set up the `children` object for
        // storing all of the child views
        _initChildViewStorage: function(){
            this.children = new Backbone.ChildViewContainer();
        },

        // Handle cleanup and other closing needs for
        // the collection of views.
        close: function(){
            if (this.isClosed){ return; }

            this.triggerMethod("collection:before:close");
            this.closeChildren();
            this.triggerMethod("collection:closed");

            Marionette.View.prototype.close.apply(this, arguments);
        },

        // Close the child views that this collection view
        // is holding on to, if any
        closeChildren: function(){
            this.children.each(function(child){
                this.removeChildView(child);
            }, this);
            this.checkEmpty();
        }
    });

    // Marionette.bindEntityEvents & unbindEntityEvents
    // ---------------------------
    //
    // These methods are used to bind/unbind a backbone "entity" (collection/model)
    // to methods on a target object.
    //
    // The first parameter, `target`, must have a `listenTo` method from the
    // EventBinder object.
    //
    // The second parameter is the entity (Backbone.Model or Backbone.Collection)
    // to bind the events from.
    //
    // The third parameter is a hash of { "event:name": "eventHandler" }
    // configuration. Multiple handlers can be separated by a space. A
    // function can be supplied instead of a string handler name.

    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function bindFromStrings(target, entity, evt, methods){
        var methodNames = methods.split(/\s+/);

        _.each(methodNames, function(methodName) {

            var method = target[methodName];
            if(!method) {
                throwError("Method '"+ methodName +"' was configured as an event handler, but does not exist.");
            }

            target.listenTo(entity, evt, method);
        });
    }

    // Bind the event to a supplied callback function
    function bindToFunction(target, entity, evt, method){
            target.listenTo(entity, evt, method);
    }

    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function unbindFromStrings(target, entity, evt, methods){
        var methodNames = methods.split(/\s+/);

        _.each(methodNames, function(methodName) {
            var method = target[methodName];
            target.stopListening(entity, evt, method);
        });
    }

    // Bind the event to a supplied callback function
    function unbindToFunction(target, entity, evt, method){
            target.stopListening(entity, evt, method);
    }


    // generic looping function
    function iterateEvents(target, entity, bindings, functionCallback, stringCallback){
        if (!entity || !bindings) { return; }

        // allow the bindings to be a function
        if (_.isFunction(bindings)){
            bindings = bindings.call(target);
        }

        // iterate the bindings and bind them
        _.each(bindings, function(methods, evt){

            // allow for a function as the handler,
            // or a list of event names as a string
            if (_.isFunction(methods)){
                functionCallback(target, entity, evt, methods);
            } else {
                stringCallback(target, entity, evt, methods);
            }

        });
    }

    // Export Public API
    Marionette.bindEntityEvents = function(target, entity, bindings){
        iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
    };

    Marionette.unbindEntityEvents = function(target, entity, bindings){
        iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
    };
    
});
