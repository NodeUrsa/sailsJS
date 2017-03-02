define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'metro',
	'text!templates/jobs/row.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

	'use strict';

	return Marionette.ItemView.extend({

		tagName: 'tr',

		template: rowTemplate,

        attributes: function(){
           return {"data-id": this.model.get('_id')};
        },

        initialize: function(){
        },

        events: {

		}

	});

});