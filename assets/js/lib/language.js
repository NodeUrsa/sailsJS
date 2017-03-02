define([], function () {
    "use strict";
    var Language = {
        roles: {
            ROLE_USER: "User",
            ROLE_WAREHOUSE_MANAGER: "Warehouse Manager",
            ROLE_ADMIN: "Administrator",
            ROLE_SUPER_ADMIN: "Super Administrator"
        },
        defaultRole: "ROLE_USER",
        getRoleDisplay: function (role) {
            var display = this.roles[role] || this.roles[this.defaultRole];
            return display;
        }
    };
    return Language;
});
