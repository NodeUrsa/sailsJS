define(['backbone'], function (Backbone) {
    "use strict";
    var OrderActivity = Backbone.Model.extend({
        defaults: {
            id: null,
            abbrev: null,
            name: null,
            active: true
        }
    });
    return OrderActivity;
});
