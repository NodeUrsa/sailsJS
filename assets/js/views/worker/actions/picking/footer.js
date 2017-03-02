define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/picking/footer.html'
    ], function ($, _, Backbone, Marionette,

        layoutTemplate
    ) {

        'use strict';

        return Marionette.ItemView.extend({

            template: layoutTemplate
        });
});