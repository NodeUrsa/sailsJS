define(['backbone'], function (Backbone) {
    "use strict";
    var UserModel = Backbone.Model.extend({
        
        defaults: {
            role: 3
        },

        checkModelAttr: function(map){


            return map;
        }







    });

    UserModel.prototype.hasRole = function (role) {
        var roles = this.get('roles') || [];
        return roles.indexOf(role) > -1;
    };

    UserModel.prototype.isAdmin = function () {
        return this.get('role') == 1;
    };

    UserModel.prototype.isManager = function () {
        return this.get('role') == 2;
    };

    return UserModel;
});
