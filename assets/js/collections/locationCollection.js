define(['backbone', 'models/locationModel'], function (Backbone, Location) {
    "use strict";
    var Locations = Backbone.Collection.extend({
        model: Location,
        comparator: "name",
        url: "/api/locations"
    });
    return Locations;
});
