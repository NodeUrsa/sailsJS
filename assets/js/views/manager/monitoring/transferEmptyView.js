define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/monitoring/transferEmpty.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,


        initialize: function(){},

        events: {},

        onClick: function () {},

        onDblclick: function () {}
    });
});
