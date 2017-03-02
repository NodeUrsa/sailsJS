define(['backbone', 'models/manager/monitoring'], function (Backbone, Model) {
    "use strict";
    return Backbone.Collection.extend({
        model: Model,
        url: "/manager/monitoring"

    });
});
