define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Routers
    var Router      = require('routers/manager');

    // error view
    var ErrorView      = require('errorView');

    // Models
    var UserModel   = require('models/userModel');
    var infoModel	= require('models/info');
    
    $.ajaxSetup({
        headers: {
            Accept : "application/json; charset=utf-8",
            "Content-Type": "application/json"
        }
    });
    
    var app = new Marionette.Application({

        verifyLoggedIn: function () {
            Backbone.ajax('/auth/me', {
                success: function (userData) {
                    if (userData) {
                        app.me = new UserModel();
                        app.me.set(app.me.parse(userData));
                        app.loggingIn = false;
                        app.router = new Router();
                        if (!window.location.hash) {
                            window.location.hash = 'home';
                        }
                    } else {
                        app.loggingIn = false;
                        window.location = '/manager/login';
                    }
                },
                error: function () {
                    app.loggingIn = false;
                    window.location = '/manager/login';
                }
            });
        },

        adminError : function(options){
            if(options) {
                var content = new ErrorView(options).render().el;
                $('body').append(content);
            }
        },

        onStart: function () {
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

    app.vent.on('adminError', app.adminError);


    // TODO: remove this by using app as requirejs dependency
    window.app = app;

    return app;
});