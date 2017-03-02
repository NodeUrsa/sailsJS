define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',

        'text!templates/worker/login.html'
        ], function ($, _, Backbone, Marionette,

        		layoutTemplate) {

	'use strict';

	return Marionette.Layout.extend({

		className:'modal',
		template: layoutTemplate,
		digits:null,

		events:{
			'click .tile':'buttonPress'//,
			//'mousedown .tile':'mousedown',
			//'mouseup .tile':'mouseup'
		},

		initialize: function () {
			this.digits=[];
			//console.log(this.model.toJSON());
		},

		buttonPress:function(e){
			$(e.currentTarget).find('i').css({'background-color':'#008a00', 'color':'#fff'});
			var timeout = setTimeout(function(){
				$(e.currentTarget).find('i').css({'background-color':'#fff', 'color':'#666666'});
			},200);


			if(this.digits.length < 4){
				this.digits.push($(e.currentTarget).find('i').text());
			}
			if(this.digits.length == 4){
				this.checkPass(parseInt(this.digits.join('')));
			}
		},

		//mousedown:function(e){
			//console.log($(e.currentTarget));
			//$(e.currentTarget).find('i').css({'background-color':'#008a00'});
		//},

		//mouseup:function(e){
			//console.log($(e.currentTarget));
			//$(e.currentTarget).find('i').css({'background-color':'#fff'});
		//},

		checkPass:function(password){
			this.login(password);
		},

		login:function(password){
			$('.window-overlay').click();

			Backbone.ajax('/auth/login', {
				data:{'userName':this.model.get('userName'), 'password':password},
				success: _.bind(function (response) {
					console.log('response',response);
					app.me = this.model;
					app.router.navigate('home', {trigger: true});
				}, this),
				error: function (response) {
					console.log('response error',response);
				}
			});
		}
	});
});