define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './editLocation',
    './locations',
    './warehouse',
    'collections/admin/locationCollection',
    'text!templates/manager/locations/main.html'
], function ($, _, Backbone, Marionette, METRO,

        EditLocation,
        Locations,
        Warehouse,
        LocationCollection,
        layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        template: layoutTemplate,
        
        regions:{
            locations:'.locations',
            warehouse:'.warehouse'
        },

        events: {
            'click .edit-location': 'editLocation'
        },

        initialize: function () {
        	this.listenTo(this.collection, 'sort', this.render);
        	this.listenTo(this.collection, 'change', this.render);
        },

        onRender : function () {
        	console.log(this.collection.toJSON());
            this.locations.show(new Locations({
                collection: new LocationCollection(this.collection.get(app.me.get('locationId')))
//                collection: new LocationCollection(this.collection.get(10))
            }));
            //this.warehouse.show(new Warehouse({collection:this.collection}));
        },
        
        editLocation : function (e) {
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'));
            
            var model = this.collection.findWhere({'id':id}) || null;
            
            if (!id) {
                return;
            }
            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action.replace('_', ' ')+'</span>',
                width: 850,
                height:490,
                padding: 50,
                content: new EditLocation({model:model, collection: this.collection}).render().el
            });
        }
    });
});