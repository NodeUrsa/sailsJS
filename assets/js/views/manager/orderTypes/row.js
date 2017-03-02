define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/orderTypes/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },
        
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
                    '7': 'Others',
                    '8': ""
                },
                booleanValue = {
                    true: "<i class='icon-checkmark'></i>",
                    false: ""
                };

            order.orderType = types[order.orderType];
            order.orderSubType = subTypes[order.orderSubType];

            order.splitFlag = booleanValue[order.splitFlag == true];
            order.pickPackFlag = booleanValue[order.pickPackFlag == true];
            order.freightFlag = booleanValue[order.freightFlag == true];
            order.wrapFlag = booleanValue[order.wrapFlag == true];
            order.binLocationFlag = booleanValue[order.binLocationFlag == true];

            return order;
        },

        onClick: function (e) {
            var checkbox = this.$('td input[type="radio"]');
            if (e.target && e.target.nodeName.toLowerCase() !== 'input') {
                checkbox.prop('checked', !checkbox.prop('checked'));
            }
        },

        onDblclick: function () {}
    });
});