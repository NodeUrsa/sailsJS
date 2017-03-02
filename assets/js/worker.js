define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Routers
    var Router      = require('routers/worker'),
        Scanner     = require('modules/scanner/main');

    /*var Home        = require('views/worker/home'),
        Picking     = require('views/worker/actions/picking/main'),
        Packing     = require('views/worker/actions/packing/main');*/
    var infoModel		= require('models/info');

    var app = new Marionette.Application({
        onStart: function () {
            /*app.router = new Router();
            Backbone.history.start();*/
        }
    });

    app.addRegions({
        scanner: '.scanner',
        page: '#page'
    });

    app.addInitializer(function () {
        _.extend(Marionette.TemplateCache.prototype, {
            loadTemplate: function (tpl) {
                return tpl;
            }
        });
    });
    
    app.addInitializer(function () {
        $('body').append('<div class="scanner"></div>');
        app.scanner.show(new Scanner());
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

    app.addInitializer(function(){
        app.router = new Router();
        Backbone.history.start();
    });

    // TODO: remove this by using app as requirejs dependency
    window.app = app;

    return app;
});