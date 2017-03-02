define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'moment',
    'text!templates/kiosk/order/row.html',
    'text!templates/kiosk/page2_orderdetail.html'
], function ($, _, Backbone, Marionette, METRO, moment, rowTemplate, orderDetailTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },

        serializeData: function () {
            var data = this.model.toJSON();
            data.orderDate = moment(data.orderDate).format('MMMM Do YYYY');
            data.releasedDate = moment(data.releasedDate).format('MMMM Do YYYY');
            data.pickupTime = moment("Mon Sep 08 2014 " + data.pickupTime).format('h:mm a');
            return data;
        },

        onClick: function (e) {
            if(this.model.get('orderStage') == "Ship Ready"){
                var checkbox = this.$('td input[type="checkbox"]');
                if (e.target && e.target.nodeName.toLowerCase() !== 'input') {
                    checkbox.prop('checked', !checkbox.prop('checked'));
                }
                this.model.set('checked', checkbox.prop('checked'));
            }
        },

        onDblclick: function () {
            var self    = this,
                orderId = this.model.get('id'),
                details = new (Backbone.Collection.extend({ url: '/kiosk/details' }));

            details.fetch({
                data: {
                    deliveryNum: this.model.get('deliveryNum')
                },
                success: function () {
                    $.Dialog({
                        overlay: true,
                        shadow : true,
                        flat   : true,
                        icon   : '',
                        title  : 'Order - ' + self.model.get('id'),
                        width  : '80%',
                        height : '80%',
                        content: '',
                        padding: 30,
                        onShow : function (_dialog) {
                            var content = _dialog.children('.content');
                            content.html(_.template(orderDetailTemplate, { orderItems: details }));
                        }
                    });
                }
            });
        }

    });

});