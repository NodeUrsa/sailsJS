define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Routers
    var Router      = require('routers/calls');

    var app = new Marionette.Application({

        verifyLoggedIn: function () {
            // TODO: check URL HASH
        },

        onStart: function () {
            app.router = new Router();
            console.log('start app test "jobs"');
        }

    });

    app.addInitializer(function () {
        this.verifyLoggedIn();
        // Pass in our Router module and call it's initialize function
        // Session.initialize();
        // MetroSideBar.initialize();
    });

    app.addInitializer(function () {
        _.extend(Marionette.TemplateCache.prototype, {
            loadTemplate: function (tpl) {
                return tpl;
            }
        });
    });

    // TODO: remove this by using app as requirejs dependency
    window.app = app;

    return app;
});