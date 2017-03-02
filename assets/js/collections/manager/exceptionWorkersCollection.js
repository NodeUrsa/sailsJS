define(['backbone', 'models/manager/exceptionWorkersModel'], function (Backbone, Model) {
    "use strict";
    return Backbone.Collection.extend({
        model: Model,
        url: "/monitoring/exception/workers"
    });
});
