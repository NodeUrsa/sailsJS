define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var Main        = require('views/manager/main'),
        Home        = require('views/manager/home');
    
    return Backbone.Router.extend({

        routes: {
            ''          : 'manager',
            'home'      : 'manager',
            ':param'    : 'renderPage'
        },
        
        initialize:function(){
            Backbone.history.start();
        },

        manager: function () {
            var home = new Home();
            home.render();
        },

        renderPage: function (param) {
            var mainView = new Main({ 'section': param });
            mainView.render();
        }
    });
});