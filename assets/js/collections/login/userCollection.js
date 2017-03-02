define(['backbone', 'models/userModel'], function (Backbone, User) {
    "use strict";
    var Users = Backbone.Collection.extend({
        model: User,
        location: null,
        url: function () {
            var url;
            if (this.location) {
                url = this.location.url().concat("/users");
            }
            return url;
        }
    });
    return Users;
});
