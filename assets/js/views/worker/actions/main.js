/*define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'metro',

        'views/worker/home',
        'views/worker/actions/picking/main',
    	'views/worker/actions/packing/main'
        
        ], function ($, _, Backbone, Marionette,metro,

        	Home,
        	Picking,
        	Packing	
        ) {

	'use strict';

	return Marionette.Layout.extend({

		//el: $('#page'),

		events:{},

		regions: {
			'main':'#page'
		},

		initialize: function () {},

		onRender: function () {},

		picking:function(e){
			console.log('home view');
			this.main.reset();
			this.main.show(new Picking());
			console.log('home view', this.main);
		},
		
		packing:function(e){
			console.log('home view');
			this.main.reset();
			this.main.show(new Packing());
			console.log('home view', this.main);
		},

		home:function(e){
			console.log('home view');
			this.main.reset();
			this.main.show(new Home());
			console.log('home view', this.main);
		}
	});
});*/