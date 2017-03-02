define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/admin/orderMatrix/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,
        
        serializeData:function(){
            var order = this.model.toJSON(),
                types = {
                    '1': 'Will Call',
                    '2': 'Express',
                    '3': 'Truck'
                },
                subTypes = {
                    '0': 'UPS',
                    '1': 'Fedex',
                    '2': 'OnTrac',
                    '3': 'LoneStar',
                    '4': 'SpeeDee',
                    '5': 'BBExpress',
                    '6': 'MGC',
                    '7': 'Others'
                };
            order.orderType = types[order.orderType];
            order.orderSubType = subTypes[order.orderSubType];
            return order;
        },

        events: {

        }

    });
});