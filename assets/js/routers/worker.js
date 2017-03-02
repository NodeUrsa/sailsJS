define(function (require) {
    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone');

    // Views
    var SelectWorker        = require('views/worker/selectWorker/main'),
        Home				= require('views/worker/home'),
        Picking     		= require('views/worker/actions/picking/main'),
    	Packing     		= require('views/worker/actions/packing/main');
    
    return Backbone.Router.extend({
    	
    	actions:{
    		'home':Home,
    		'picking':Picking,
    		'packing':Packing
    	},

        routes: {
            ''          : 'index',
            'picking'   : 'picking',
            'packing'   : 'packing',
            'home'      : 'home'
        },
        
        initialize:function(){
            console.log('router init');
            //Backbone.history.start();
            //this.mainView = new MainView();
        },
//TODO router hash reseting problem
        index: function () {
            app.page.show(new SelectWorker());
        },

        home: function () {
            if(!app.me) {this.navigate('', {trigger: true});return;}
            app.page.show(new Home());
        },

        picking: function () {
            if(!app.me) {this.navigate('', {trigger: true});return;}
            app.page.show(new Picking());
        },

        packing: function () {
            if(!app.me) {this.navigate('', {trigger: true});return;}
            app.page.show(new Packing());
        }
    });
});