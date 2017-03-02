define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/admin/userSetup/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },

        serializeData: function () {
            var user = this.model.toJSON(),
                roles = {
                    '1': 'Admin',
                    '2': 'Manager',
                    '3': 'Worker',
                    '4': 'Call Center',
                    '5': 'Manager/Worker'
                };
            user.role = roles[user.role];
            return user;
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