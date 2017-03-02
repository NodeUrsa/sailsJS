define(['backbone', 'models/userModel'], function (Backbone, User) {
    "use strict";
    var Users = Backbone.Collection.extend({
        model: User,
        url: "/api/users"
    });
    return Users;
});
