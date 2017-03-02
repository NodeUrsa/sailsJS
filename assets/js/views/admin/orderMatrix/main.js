define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './addMatrixItem',
    './updateOrderMatrix',

    'collections/admin/orderMatrixCollection',
    'collections/admin/orderTypesCollection',
    'text!templates/admin/orderMatrix/main.html'
], function ($, _, Backbone, Marionette, METRO,

        Row,
        addMatrixItem,
        updateOrderMatrix,
        Collection,
        OrderTypesCollection,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,

        itemViewContainer: 'tbody',
        
        events: {
            'click header .btn': 'headerButtonPress'
        },

        initialize: function () {
            this.triggerMethod("render:collection");
            var that = this;
            this.orderTypesCollection = new OrderTypesCollection();
            this.orderTypesCollection.fetch({data:{'locationId':this.options.locationId}},{
                success: function(collection){
                    console.log(collection.toJSON());
                }
            });
            this.collection = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId},
                success: function(collection){
                    console.log(collection.toJSON());

                    that.collection = collection;
                    that.reRender();
                },
                error: function(){}





            });
            this.listenTo(this.collection, 'change', this.reRender, this);

        },

        onRender : function () {},
        onRenderCollection : function () {
            if(this.collection != null){
                var coll = this.collection.toJSON();
                console.log(coll);
            }

        },

        reRender: function(){
            this.collection.sort();

            this.render();
        },

        onShow: function(){
            this.reRender();
        },

        countOrderTypes: function(collection){

            var arrToUnDisplay = [];
            if(collection.where({orderType: 2}).length >= 1){arrToUnDisplay.push({type: 'type', value: 2})}
            if(collection.where({orderType: "2"}).length >= 1){arrToUnDisplay.push({type: 'type', value: 2})}
            if(collection.where({orderType: 1}).length >= 1){arrToUnDisplay.push({type: 'type', value: 1})}
            if(collection.where({orderType: "1"}).length >= 1){arrToUnDisplay.push({type: 'type', value: 1})}
            if(collection.where({orderType: 3}).length >= 1){arrToUnDisplay.push({type: 'type', value: 3})}
            if(collection.where({orderType: "3"}).length >= 1){arrToUnDisplay.push({type: 'type', value: 3})}
            if(collection.where({orderSubType: 0}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 0})}
            if(collection.where({orderSubType: "0"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 0})}
            if(collection.where({orderSubType: 1}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 1})}
            if(collection.where({orderSubType: "1"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 1})}
            if(collection.where({orderSubType: 2}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 2})}
            if(collection.where({orderSubType: "2"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 2})}
            if(collection.where({orderSubType: 3}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 3})}
            if(collection.where({orderSubType: "3"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 3})}
            if(collection.where({orderSubType: 4}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 4})}
            if(collection.where({orderSubType: "4"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 4})}
            if(collection.where({orderSubType: 5}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 5})}
            if(collection.where({orderSubType: "5"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 5})}
            if(collection.where({orderSubType: 6}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 6})}
            if(collection.where({orderSubType: "6"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 6})}
            if(collection.where({orderSubType: 7}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 7})}
            if(collection.where({orderSubType: "7"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 7})}
            return arrToUnDisplay;
        },
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');

            if (action == 'add') {
                var availableOrdersTypes = this.countOrderTypes(this.orderTypesCollection);
                var alreadyExistOrdersTypes = this.countOrderTypes(this.collection);



                var dialog;

                dialog = $.Dialog({
                    shadow: true,
                    overlay: true,
                    flat: true,
                    icon: '',
//                title: '<span class="capitalize"></span>',
                    width: 500,
                    height:400,
                    padding: 20,
                    content: new addMatrixItem({locationId: this.options.locationId, collection:this.collection, availableOrdersTypes: availableOrdersTypes, alreadyExistOrdersTypes: alreadyExistOrdersTypes, action: action}).render().el
                });
            }
            if (action == 'edit') {
                dialog = $.Dialog({
                    shadow: true,
                    overlay: true,
                    flat: true,
                    icon: '',
//                title: '<span class="capitalize"></span>',
                    width: 1000,
                    height:600,
                    padding: 20,
                    content: new updateOrderMatrix({locationId: this.options.locationId, collection:this.collection}).render().el
                });
            }
            

        }
    });
});