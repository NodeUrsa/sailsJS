define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!./../templates/emptyTemplate.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,


        initialize: function(){}


    });
});
