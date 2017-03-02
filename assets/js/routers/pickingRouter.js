define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var PickingPage = require('views/picking/main');

    return Backbone.Router.extend({

        routes: {
            'picking'       : 'picking'
        },

        initialize: function () {
            this.page = new PickingPage();
        },

        picking: function () {
            this.page.render();
        }

    });

});
