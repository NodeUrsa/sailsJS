define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/admin/security/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,
        
        serializeData:function(){

            var order = this.model.toJSON(),
                equipmentTypes = {
                    '1': '<i class="icon-screen"></i>&nbsp;&nbsp;Workstation',
                    '2': '<i class="icon-tablet"></i>&nbsp;&nbsp;Tablet',
                    '3': '<i class="icon-mobile"></i>&nbsp;&nbsp;Mobile Cell Phone',
                    '4': 'Other'
                },
                status = {
                    '0': 'Inactive',
                    '1': 'Active'
                };
            order.equipmentType = equipmentTypes[order.equipmentType];
            order.status = status[order.status];
            return order;
        }



    });
});