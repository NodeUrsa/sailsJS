define(['backbone', 'models/admin/userModel'], function (Backbone, User) {
    "use strict";
    var Users = Backbone.Collection.extend({
        model: User,
        url:"/user"
    });
    return Users;
});
