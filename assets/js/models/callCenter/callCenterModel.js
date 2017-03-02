define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
        urlRoot: "/callcenter/orders"
    });
});
