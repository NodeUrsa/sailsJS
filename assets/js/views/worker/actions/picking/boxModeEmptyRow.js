define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/picking/boxModeEmptyRow.html'
    ], function ($, _, Backbone, Marionette,

        template
    ) {

        'use strict';

        return Marionette.ItemView.extend({
        	tagName:'tr',
            template: template
        });
});