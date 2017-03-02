define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/admin/security/securityRow.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,
        
        serializeData:function(){
            var order = this.model.toJSON(),
                equipmentTypes = {
                    '1': 'Workstation',
                    '2': 'Tablet',
                    '3': 'Mobile Cell Phone',
                    '4': 'Other'
                },
                status = {
                    '0': 'Inactive',
                    '1': 'Active'
                };
            order.equipmentType = equipmentTypes[order.equipmentType];
            order.status = status[order.status];
            return order;
        },


        events: {
            'click'   : 'onClick'
        },

        onClick: function (e) {
            var checkbox = this.$('td input[type="radio"]');
            if (e.target && e.target.nodeName.toLowerCase() !== 'input') {
                checkbox.prop('checked', !checkbox.prop('checked'));
            }
            $(e.target).closest('tr').toggleClass('selected').siblings().removeClass('selected');

        }


    });
});