define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/locations/warehouse_row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },

        onClick: function (e) {},

        onDblclick: function () {}
    });
});