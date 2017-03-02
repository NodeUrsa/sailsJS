define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/calls/layout.html',
    'metro_ui',
    './content/main',



    '../header',
    '../../widgets/sidebar/main',
    'collections/admin/locationCollection'
], function ($, _, Backbone, Marionette, METRO,

             layoutTemplate,
             metro_ui,

             CallsView,

             Header,
             SidebarWidget,
             LocationCollection
    ) {

    'use strict';

    return Marionette.Layout.extend({

        el: $('#page'),

        template: layoutTemplate,

        regions: {
            header : 'header',
            content : '.adminContent',
            menu : 'nav'
        },
        selectLocationId: null,


        initialize: function () {
            this.collection = new LocationCollection();
            var that = this;
            this.collection.fetch({
                success:function(){
                    that.render();
                }
            });
        },


        onRender: function () {
            this.showMenu();
            this.showHeader();
            this.showContent();
        },

        showMenu: function(){
            var submenu = this.collection.toJSON(),
                menuView = new SidebarWidget({
                    collection: new Backbone.Collection([
                        {
                            name: 'Location',
                            link: {
                                ref: 'CallCenter'
                            },
                            submenu: submenu,
                            callback: _.bind(this.changeLocation, this)
                        }
                    ]),
                    style: {
                        theme: 'light'
                    },
                    dropDown: {"1": true}
                });
            this.menu.show(menuView);
        },

        showHeader: function(){
            this.header.show(new Header({section: "Call Center"}));
        },

        changeLocation:function(model, location){
                this.showContent(model.get('link').ref, location);
        },

        showContent:function(section, location){

            var id = null;
            if(this.collection.length){
                location = location || this.collection.first().get('shortName');
                id = (this.collection.findWhere({'shortName':location}))?this.collection.findWhere({'shortName':location}).get('id'):0;
            }
            if(id != this.selectLocationId && id != null) {
                this.selectLocationId = id;
                var contentView = new CallsView({locationId: id, context: this});
                if(this.content.currentView){this.content.currentView.undelegateEvents()}
                this.content.show(contentView);
            }

        }
    });
});