define(['backbone', 'models/admin/orderMatrixModel'], function (Backbone, OrderMatrix) {
    "use strict";
    var OrderMatrix = Backbone.Collection.extend({
        model: OrderMatrix,
        comparator: 'ranking',
        url: "/ordermatrix"
    });
    return OrderMatrix;
});
