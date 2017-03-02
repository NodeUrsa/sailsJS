define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    var OrderType = Backbone.Model.extend({
        defaults: {
            id: null,
            abbrev: null,
            name: null,
            referenceId: null,
            specific: false,
            freight: false,
            active: true,
            activities: [],
            locations: []
        },

        addLocation: function (location) {
            this.addItemToAttr('locations', location);
        },

        removeLocation: function (location) {
            this.removeItemFromAttr('locations', location);
        },

        addActivity: function (activity) {
            this.addItemToAttr('activities', activity);
        },

        removeActivity: function (activity) {
            this.removeItemFromAttr('activities', activity);
        },

        addItemToAttr: function (attr, item) {
            var original = Underscore.reject(this.get(attr), function (oItem) {
                return oItem.id === item.id;
            });
            original.push(item);
            this.set(attr, original);
        },

        removeItemFromAttr: function (attr, item) {
            this.set(attr, Underscore.reject(
                this.get(attr),
                function (oItem) {
                    return oItem.id === item.id;
                }
            ));
        }
    });
    return OrderType;
});
