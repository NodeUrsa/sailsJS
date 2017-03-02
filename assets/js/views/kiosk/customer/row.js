define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'metro',
	'text!templates/kiosk/customer/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

	'use strict';

	return Marionette.ItemView.extend({

		tagName: 'tr',

		template: rowTemplate,

		events: {
			'click': 'onClick'
		},

		onClick: function () {
			app.vent.trigger('kiosk:customer:select', this.model.toJSON());
		}

	});

});