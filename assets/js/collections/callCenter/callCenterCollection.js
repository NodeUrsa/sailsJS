define(['backbone', 'models/callCenter/callCenterModel'], function (Backbone, Model) {
    "use strict";
    return Backbone.Collection.extend({
        model: Model,
        url: "/callcenter/orders"
    });
});
