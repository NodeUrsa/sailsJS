define(['backbone', 'models/orderModel'], function (Backbone, Queue) {
    "use strict";
    var Orders = Backbone.Collection.extend({
        model: Queue,
        url: "/api/orders"
    });
    return Orders;
});
