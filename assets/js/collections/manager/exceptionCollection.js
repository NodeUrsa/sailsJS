define(['backbone', 'models/manager/exceptionModel'], function (Backbone, Model) {
    "use strict";
    return Backbone.Collection.extend({
        model: Model,

        url: "/monitoring/exception/orders"

    });
});
