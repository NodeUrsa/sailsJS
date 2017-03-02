define([
  'jquery',
  'underscore',
  'backbone',
  'metro',
  'text!templates/common/header.html',
  'libs/jquery-ui/jquery.widget.min',
  'libs/jquery/jquery.cookie',
  'metro_ui'
], function($, _, Backbone, METRO, headerTemplate){
	"use strict";
	
	var userHomeView = Backbone.View.extend({
		el: $("#page"),
		initialize: function() {
		},
		render: function(){
			var that = this;
			
			var theme = window.theme;

			var tiles = [
				{
					'name'		 : 'user_activities',
					'thumbnail'	: '',
					'title' 	  	: 'Activities',
					'content' 	  : 'Activities',
					'url' 		  : '#user/activities',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/willcall_activities'
				},
				{
					'name'		 : 'user_item_lookup',
					'thumbnail'	: '',
					'title' 	  	: 'Item Lookup',
					'content' 	  : 'Item Lookup',
					'url' 		  : '#user/item_lookup',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/item_lookup'
				},
				{
					'name'		 : 'user_customer_lookup',
					'thumbnail'	: '',
					'title' 	  	: 'Customer Lookup',
					'content' 	  : 'Customer Lookup',
					'url' 		  : '#user/customer_lookup',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/customer_lookup'
				},
				{
					'name'		 : 'user_company_announcements',
					'thumbnail'	: '',
					'title' 	  	: 'Company Announcements',
					'content' 	  : 'Company Announcements',
					'url' 		  : '#user/company_accouncements',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/company_announcements'
				},
				{
					'name'		 : 'user_main_order_queue',
					'thumbnail'	: '',
					'title' 	  	: 'Main Order Queue',
					'content' 	  : 'Main Order Queue',
					'url' 		  : '#user/main_order_queue',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/main_order_queue'
				},
				{
					'name'		 : 'user_cycle_count',
					'thumbnail'	: '',
					'title' 	  	: 'Cycle Count',
					'content' 	  : 'Cycle Count',
					'url' 		  : '#user/cycle_count',
					'size'		 : '4x2',
					'theme'		: theme,
					'link'		 : '#user/cycle_count'
				}
			];
			
			//remove old tiles
			Metro.clearTiles();
			
			this.$el.html('');
			
			Metro.data = [];
			Metro.HTML.addContainer({'size':'full', 'tiles':tiles});
			Metro.init();
			
			$(document).unbind('click', Metro.Events.onClick);
				
			$('#widget_scroll_container .widget_container .widget .widget_content .main').each(function() {

				$(this).click(function(e) {
					e.preventDefault();
					
					Metro.clearTiles();
					
					Metro.Events.onClick(e);
				});
			});
		}
	});
	
	return userHomeView;
  
});
