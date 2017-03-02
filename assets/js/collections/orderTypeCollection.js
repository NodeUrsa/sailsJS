define(['backbone', 'models/orderTypeModel'], function (Backbone, OrderType) {
    "use strict";
    var OrderTypes = Backbone.Collection.extend({
        model: OrderType,
        comparator: "name",
        url: "/api/order/types"
    });
    return OrderTypes;
});
