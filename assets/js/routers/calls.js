define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var Main        = require('views/calls/main');

    return Backbone.Router.extend({

        routes: {
            ''          : 'renderPage'
//            'home'      : 'admin',
//            ':param'    : 'renderPage'
        },

        initialize:function(){
            Backbone.history.start();
        },

//        admin: function () {
//            var home = new Home();
//            home.render();
//        },

        renderPage: function () {
            var mainView = new Main();
            mainView.render();
        }

    });
});