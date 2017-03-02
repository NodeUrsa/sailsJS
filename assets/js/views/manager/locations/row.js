define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/locations/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        serializeData: function(){

            var model = this.model.managerTimeConvert(this.model.toJSON());

            return model;
        },

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
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