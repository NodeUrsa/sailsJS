define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './tabView',
    './exception/exceptionTabView',
    'collections/admin/orderTypesCollection',
    'text!templates/manager/monitoring/main.html'
], function ($, _, Backbone, Marionette, METRO,

        TabView,
        ExeptionTabView,
        Collection,
        layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        template: layoutTemplate,
        currentTab : 0,
        className:'tab-wraper',
        
        events: {
           'click .button-set button:not(.disabled)' : 'changeView'
        },

        initialize: function () {
            var that = this;
            this.collection    = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId},
                success:function(collection, response){
//                	console.log('collection', collection);
//                	console.log('response', response);
                	that.render();}
            });
        },
        
        regions:{
            tabView:'.tabView'
        },

        onRender : function () {
            this.getOrderTypes();
        },
        
        changeView:function(e){
            this.$('.button-set button').removeClass('active');
            $(e.currentTarget).addClass('active');
            
            this.currentTab = parseInt($(e.currentTarget).attr('tab'));
            this.getOrderTypes();
        },
        
        getOrderTypes:function(){
            var collection;
            if(this.currentTab < 3){
                collection = new Collection(this.collection.where({'orderType': this.currentTab+1}));
                this.tabView.show(new TabView({tab:this.currentTab, collection:collection, orderType:this.currentTab+1}));
            }
            else{
                collection = this.collection;
                this.tabView.show(new ExeptionTabView({tab:this.currentTab, orderType:this.currentTab+1}));
            }
        }
    });
});