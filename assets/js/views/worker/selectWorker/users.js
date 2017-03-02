define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './userItem',
    'text!templates/worker/selectWorker/users.html'
], function ($, _, Backbone, Marionette, METRO,

        ItemView,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: ItemView,

        itemViewContainer: '.items',

        events: {
            'click .change': 'changeLocation',
            'click .filter' : 'onSelectFilter'
        },
        
        collectionEvents: {
            "sort": "modelAdded"
        },
        
        serializeData: function () {
            return {
                filter: this.filter
            };
        },

        initialize: function () {
        	this.filter = '';
        },
        
        modelAdded:function(){
        	this.collection = new Backbone.Collection(this.collection.toJSON().slice(0,12));
        	this.render();
        },
        
        changeLocation : function (e) {
        	$.cookie('locationId', null, { path: '/',expires: -1 });
            this.options.parent.changeLocation();
        },
        
        onSelectFilter: function () {
            var that = this,
                $button = $(event.target);

            this.filter = $button.data('keyword');
            this.collection = this.options.users.filter(function (item) {
                if (!that.filter) {
                    return true;
                } else {
                    for (var i = 0; i < that.filter.length; i++) {
                        if (that.filter[i] == item.get('lastName')[0].toLowerCase()) {
                            return true;
                        }
                    }
                }
                return false;
            });
            this.collection = new Backbone.Collection(this.collection);
            this.render();
        }
    });
});