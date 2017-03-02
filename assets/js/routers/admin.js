define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var Main        = require('views/admin/main'),
        Home        = require('views/admin/home');
    
    return Backbone.Router.extend({

        routes: {
            ''          : 'admin',
            'home'      : 'admin',
            ':param'    : 'renderPage'
        },
        
        initialize:function(){
            Backbone.history.start();
        },

        admin: function () {
            var home = new Home();
            home.render();
        },

        renderPage: function (param) {
            var mainView = new Main({ 'section': param });
            mainView.render();
        }

    });
});