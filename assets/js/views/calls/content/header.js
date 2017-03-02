define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/calls/content/header.html'
], function ($, _, Backbone, Marionette, METRO,  Template) { //TransferView,

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',

        template: Template,

        events: {
            'click .filterAll, .filterWillCall, .filterExpress, .filterTruck': 'filterOrders',
            'click .cancelOrder, .addOrder, .shipVia' : 'buttonPress'
        },
        
        serializeData:function(){
        },
        
        initialize:function(){
        },

        resources: function (e) {
        },

        filterOrders: function(e){
            this.options.context.filterOrders({type: $(e.currentTarget).attr('data-keyword')});
//            app.vent.trigger('callCenter:orders:filter', {type: $(e.currentTarget).attr('data-keyword')});

        },

        buttonPress: function(e){
            app.vent.trigger('callCenter:header:buttonPress', {button: $(e.currentTarget).attr('data-keyword')});
        },

        transfer: function (e) {
            var id = this.options.locationId;
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
                content: new TransferView({model: this.model}).render().el
//                content: new TransferView({locationId: this.options.locationId, collection:this.collection}).render().el
            });
        }
    });
});