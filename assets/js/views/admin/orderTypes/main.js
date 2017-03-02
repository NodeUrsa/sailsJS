define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './editOrderType',
    './deleteOrderType',
    'collections/admin/orderTypesCollection',
    'text!templates/admin/orderTypes/main.html'
], function ($, _, Backbone, Marionette, METRO,

        Row,
        editOrderType,
        deleteOrderType,
        Collection,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,

        itemViewContainer: 'tbody',
        
        events: {
            //'click header .btn': 'headerButtonPress'
            'click header .btn:not(.disable, .delete-order-type)': 'headerButtonPress',
            'click .delete-order-type' : 'deleteOrderType'
        },

        initialize: function () {
            this.collection    = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId}});
            this.listenTo(this.collection,'change', this.render);
            app.vent.on('orderType:updated', this.updateCollection, this);
        },

        onRender : function () {},
        
        updateCollection:function(){
        	this.collection.fetch({data:{'locationId':this.options.locationId}});
        },
        
        headerButtonPress : function (e) {
            var that = this;
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'));
            var model = (action == 'edit') ? this.collection.findWhere({'id':id}) : null;
            
            if ((action == 'edit') && !id) {
                return;
            }

            if (action == 'delete'){
                model.destroy({
                    success: function(){},
                    error: function(){
                        var message = "can't delete order type";
                        app.vent.trigger('adminError',{type: "showMessage", message: message});
                    }
                });
                return;
            }
            this.countOrderTypes();
            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action+' Order Type</span>',
                width: 1100,
                height:250,
                padding: 20,
                content: new editOrderType({model:model, locationId: this.options.locationId, collection:this.collection, action: action, unDisplayTypesArr: this.arrToUnDisplay}).render().el
            });
        },
        
        deleteOrderType : function(){
        	var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'));
        	if(!id) return;
        	var model = this.collection.findWhere({'id':id});
        	
        	var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">Delete Order Type</span>',
                width: 450,
                height: 150,
                padding: 20,
                content: new deleteOrderType({model:model, locationId: this.options.locationId, collection:this.collection, unDisplayTypesArr: this.arrToUnDisplay}).render().el
            });
        },

        countOrderTypes: function(){

//            console.log(this.collection.toJSON());
//            console.log(this.collection.where({orderType: 1}).length);

            var arrToUnDisplay = [];
            if(this.collection.where({orderType: 1}).length >= 1){arrToUnDisplay.push({type: 'orderType', value: 1})}
            if(this.collection.where({orderType: "1"}).length >= 1){arrToUnDisplay.push({type: 'orderType', value: 1})}
            if(this.collection.where({orderType: 3}).length >= 1){arrToUnDisplay.push({type: 'orderType', value: 3})}
            if(this.collection.where({orderType: "3"}).length >= 1){arrToUnDisplay.push({type: 'orderType', value: 3})}
            if(this.collection.where({orderSubType: 0}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 0})}
            if(this.collection.where({orderSubType: "0"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 0})}
            if(this.collection.where({orderSubType: 1}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 1})}
            if(this.collection.where({orderSubType: "1"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 1})}
            if(this.collection.where({orderSubType: 2}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 2})}
            if(this.collection.where({orderSubType: "2"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 2})}
            if(this.collection.where({orderSubType: 3}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 3})}
            if(this.collection.where({orderSubType: "3"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 3})}
            if(this.collection.where({orderSubType: 4}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 4})}
            if(this.collection.where({orderSubType: "4"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 4})}
            if(this.collection.where({orderSubType: 5}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 5})}
            if(this.collection.where({orderSubType: "5"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 5})}
            if(this.collection.where({orderSubType: 6}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 6})}
            if(this.collection.where({orderSubType: "6"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 6})}
            if(this.collection.where({orderSubType: 7}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 7})}
            if(this.collection.where({orderSubType: "7"}).length >= 1){arrToUnDisplay.push({type: 'orderSubType', value: 7})}
            this.arrToUnDisplay = arrToUnDisplay;
        }
    });
});