define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Routers
    var Router      = require('routers/kiosk');

    // Models
    var UserModel   = require('models/userModel');
    var infoModel	= require('models/info');

    var app = new Marionette.Application({

        verifyLoggedIn: function () {
            // TODO: check URL HASH
        },

        onStart: function () {
            app.router = new Router();
            console.log('start app test');
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
    
    app.addInitializer(function () {
        $('body').append('<div class="version"></div>');
        var info = new infoModel();
        var ver = '0.3.0';
        info.getInfo().fetch({
        	success:function(model,response){
        		if(response.version){
        			if(ver != response.version){
        				alert('The version of application is out of date. Please, clear the cache.');
        			}
        			$('body').append('<div class="version">'+ver+'</div>');
        		}
        	}
        });
    });

    // TODO: remove this by using app as requirejs dependency
    window.app = app;

    return app;
});