// JavaScript Document

define([
  'jquery',
  'underscore',
  'backbone',
  'models/userModel',
  'metro',
  'libs/jquery/jquery.cookie'
], function($, _, Backbone, UserModel){
	function initialize () {
		var current_user = new UserModel();
		var current_user_json = $.cookie('current_user');
		
		if(typeof current_user_json == 'undefined' || current_user_json == null || current_user_json == '') 
			current_user = null;
		else {
			current_user.set(JSON.parse(current_user_json));
		}
		
		window.current_user = current_user;
		
		var theme = $.cookie('theme');
		
		if(typeof theme == 'undefined' || theme == '' || theme == null) theme = 'green';
		
		window.theme = theme;
		
		
		var location = $.cookie('user_location');
		
		if(location == null || location == '' || typeof location == 'undefined') location = null;
		
		window.user_location = location;
	}
		
	function setLocation (location) {
		$.cookie('user_location', location);
		
		window.user_location = location;
	}
		
	function setCurrentUser (user) {
		$.cookie('current_user', JSON.stringify(user.toJSON()));
		
		window.current_user = user;
	}
		
	function setTheme (theme) {
		$.cookie('theme', theme);
		
		window.theme = theme;
	}
	
	return {
		initialize : initialize,
		setLocation: setLocation,
		setCurrentUser: setCurrentUser,
		setTheme: setTheme
	};
});