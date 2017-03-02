define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette'),
        nanoscroller  = require('nanoscroller');



    // Views
    var ItemView   = require('./views/item');
    var EmptyView   = require('./views/emptyView');

    // Templates
    var layout      = require('text!./templates/main.html');

    return Marionette.CompositeView.extend({

        className: 'tableWidget',

        template: layout,

        emptyView: EmptyView,


        itemView: ItemView,

        itemViewContainer: 'tbody',

        itemViewOptions: function(){return{context: this}},

        collectionEvents: {
            "sort": "collectionLoaded",
            'reset': 'resetColl'
        },

        events: {
            'render:collection': 'onRenderCollection'
        },

        resetColl: function(){
            var that = this;
            setTimeout( function(){that.collectionLoaded()}, 10);
        },


        serializeData:function(){
            return this.model.toJSON();
        },

        initialize: function(){
            var that = this;
            this.model = new Backbone.Model(this.options);
            this.collection = this.options.collection;


            this.setSortable();

            $(window).resize(function(){that.collectionLoaded()});
        },


        onRender: function(){
            this.setTableHeight();
            this.resetColl();
        },

        collectionLoaded:function(){
            var tdColl = this.$('.table-wraper thead th');
            var thColl = this.$('.theadMain th');


            for(var i = 0; i < tdColl.length; i++) {
                var td = tdColl.eq(i),
                    th = thColl.eq(i);

//                th.css({'position': 'absolute'});
                th.outerWidth(td.outerWidth());
//                th.offset({top: th.offset().top, left: td.offset().left + 8});
//                thTop = th.offset().top;
//                th.offset({top: thTop, left: td.offset().left});
            }
            this.$('thead th').css({'visibility': 'visible'});
            this.$(".nano").nanoScroller();
        },

        setSortable: function(){
            if(this.options.sort){this.events = {'click th' : 'sort'}}
        },

        setTableHeight: function(){
            // debugger;
            this.options.height = this.options.height || 300;

            this.$('.nano').height(this.options.height);

        },

        sort:function(e){
            var el = $(e.currentTarget);

            var name = this.model.get('columns')[el.text()];

            var asc = '';
            if(el.attr('type') == 'asc'){
                asc = el.attr('type');
                el.removeAttr('type');
            }
            else{
                asc = '';
                el.attr('type', 'asc');
            }

            if(name){
                el.parent().find('i').remove();
                el.append('<i class="icon-arrow-down-4"></i>');


                this.collection.comparator = function(model){
                    return model.get(name);
                };
                this.collection.sort();

                if(asc){
                    this.collection.models = this.collection.models.reverse();
                }
                this.collection.trigger('reset');
            }
        }


    });

});
