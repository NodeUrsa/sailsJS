define(['backbone', 'models/manager/transferModel'], function (Backbone, Model) {
    "use strict";
    return Backbone.Collection.extend({
        model: Model,
        url: "/monitoring/workers"
    });
});
