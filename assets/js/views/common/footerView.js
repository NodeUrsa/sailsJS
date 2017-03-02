define([
  'jquery',
  'underscore',
  'backbone',
  'metro',
  'text!templates/common/footer.html',
  'metro_ui'
], function($, _, Backbone, METRO, footerTemplate){
	"use strict";
	
	var footerView = Backbone.View.extend({
		el: $("#footer"),
		initialize: function() {
			this.render();
		},
		render: function(){
			var that = this;
			this.$el.html(_.template(footerTemplate, this));
		}
	});
	
	return footerView;
  
});