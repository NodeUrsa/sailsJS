define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './cancelOrder',

    'collections/callCenter/callCenterCollection',
    './header',
    'widgets/tables/main',
    'text!templates/calls/content/layout.html'
], function ($, _, Backbone, Marionette, METRO,

            CancelOrderView,
            Collection,
            Header,
            TableView,
            template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        className:'tab-wraper',

        regions:{
            header:'header',
            table:'.table-box'
        },

        initialize:function(){
            var that = this;
            this.collection = new Collection();
            this.collection.fetch({
                data: {locationId: this.options.locationId},
                success: function () {
                   console.log("success get orders");
                },
                error: function () {
                    app.vent.trigger('adminError', {type: "showMessage", message: "can't get orders"});
                }
            });

        },

        onRender:function(){
            this.showHeader();
            this.showTable(this.collection);
        },

        showHeader: function(){
            this.header.show(new Header({context: this}));
        },

        showTable: function(collection){

            this.table.show(new TableView({

                name: 'callCenter',
                id: 'orderNumber',
                columns: {
                    'Type': 'orderType',
                    'Subtype': 'orderSubType',
                    'Order': 'orderNumber',
                    'Customer Name': 'customerName',
                    'City': 'shipToCity',
                    'State': 'shipToState',
                    'Order Date': 'orderDate',
                    'Emp': 'user',
                    'Stage': 'orderStage'
                },
                radio: true,
                sort: true,
                height: 500,

                collection: collection
            }));
        },

        filterOrders: function(options){
            var collection;
            if(options.type == "0"){collection = this.collection;}
            else{
                var filteredArr = this.collection.where({orderType: + options.type});
                collection = new Collection(filteredArr);
            }

            this.showTable(collection);
        },

        headerButtonPress: function(options){
            var orderNumber = this.$('tbody [type="radio"]:checked').attr("data-id");
            if(!orderNumber){
                app.vent.trigger('adminError',{type: "showMessage", message: "Please, select order"});
                return;
            }
            switch(options.button){
                case "cancelOrder":
                    this.cancelOrder(orderNumber);
                    break;
                case "addOrder":

                    break;
                case "shipVia":

                    break;
            }
        },

        cancelOrder:function(orderNumber){
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                zIndex: 500,
                icon: '',
//                title: '<span class="capitalize"></span>',
                width: 800,
                height:600,
                padding: 20,
                content: new CancelOrderView().render().el
            });
        }

    });
});