define(['backbone', 'models/locationModel'], function (Backbone, Location) {
    "use strict";
    var Locations = Backbone.Collection.extend({
        model: Location,
        comparator: "name",
        url: "/api/login/locations"
    });
    return Locations;
});
