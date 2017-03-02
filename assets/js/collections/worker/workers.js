define(['backbone', 'models/admin/userModel'], function (Backbone, User) {
    "use strict";
    return Backbone.Collection.extend({
        model: User,
        url:"/worker/users"
    });
});
