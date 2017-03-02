define(['backbone'], function (Backbone) {
    "use strict";
	
    var CustomerModel = Backbone.Model.extend({
        defaults: {
            id: null,
            customerName: null
        }
    });
    return CustomerModel;
});
