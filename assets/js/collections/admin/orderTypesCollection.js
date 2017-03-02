define(['backbone', 'models/admin/orderTypeModel'], function (Backbone, OrderType) {
    "use strict";
    return Backbone.Collection.extend({
        model: OrderType,
        comparator: function(model){return model.get('name')},
        url: "/ordertype"
    });
});
