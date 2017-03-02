define(['backbone'], function (Backbone) {
    "use strict";
    var EmployeeModel = Backbone.Model.extend({
        defaults: {
            id: null,
            customerName: null
        }
    });
    return EmployeeModel;
});
