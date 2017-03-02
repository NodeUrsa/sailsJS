define(function (require) {
    'use strict';

    // Libraries
    var $            = require('jquery'),
        Backbone     = require('backbone'),
        Marionette   = require('marionette');

    // Views
    var Jobs    = require('views/jobs/main');


    return Backbone.Router.extend({

        routes: {

        },

        initialize: function () {
            var jobs = new Jobs();
            $('#page').html(jobs.render().el);
            Backbone.history.start();
        },

        customer: function () {

        }


    });

});
