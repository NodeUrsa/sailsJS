define(['backbone'], function (Backbone) {
    "use strict";
	
    var OrderModel = Backbone.Model.extend({
        defaults: {
            id: null,
            orderType: null,
            customerId: null,
            customerName: null,
            city: null,
            state: null,
            orderDate: null,
            releaseDate: null,
            stage: null,
            employee: null
        }
    });
    return OrderModel;
});