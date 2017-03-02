define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'metro',

        'text!templates/manager/home.html'
        ], function ($, _, Backbone, Marionette, METRO,

                layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        el: $('#page'),

        template: layoutTemplate
    });
});