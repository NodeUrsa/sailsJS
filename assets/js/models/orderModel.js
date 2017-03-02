define(['backbone', 'collections/itemCollection'], function (Backbone, ItemCollection) {
	"use strict";

	var OrderModel = Backbone.Model.extend({
		defaults: {
			id: null,
			customerId: null,
			customerName: null,
			city: null,
			state: null,
			orderDate: null,
			releaseDate: null,
			weight: 0,
			pices: 0,
			binLocation: null,
			items: null,
		},
		parse: function(response) {
			return {
				id : response.id,
				customerId : response.customerId,
				customerName : response.customerName,
				city : response.city,
				state : response.state,
				orderDate : response.orderDate,
				releaseDate : response.releaseDate,
				weight : response.weight,
				pices : response.pices,
				binLocation: response.binLocation,
				items : new ItemCollection(response.items)
			};
		},
		clone: function() {
			var result = new OrderModel();

			result.set({
				id: this.id, 
				customerId: this.customerId,
				customerName: this.customerName,
				city: this.city,
				state: this.state,
				orderDate: this.orderDate,
				releaseDate: this.releaseDate,
				weight: this.weight,
				pices: this.pices,
				binLocation: this.binLocation,
				items: new ItemCollection(this.get('items').toJSON()) 
			});

			return result;
		}
	});
	return OrderModel;
});
