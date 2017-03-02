define(['backbone', 'models/orderActivityModel'], function (Backbone, OrderActivity) {
    "use strict";
    var OrderActivities = Backbone.Collection.extend({
        model: OrderActivity,
        comparator: "name",
        url: "/api/order/activities"
    });
    return OrderActivities;
});
