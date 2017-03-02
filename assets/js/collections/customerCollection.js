define([
	'backbone', 
	'models/customerModel'
], function (Backbone, CustomerModel) {
    "use strict";
    var CustomerCollection = Backbone.Collection.extend({
        model: CustomerModel,
        url: "/kiosk/customers"
    });
    return CustomerCollection;
});
