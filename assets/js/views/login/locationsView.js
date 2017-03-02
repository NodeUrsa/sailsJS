define(['backbone', 'views/login/locationView'],
    function (Backbone, ItemView) {
        "use strict";
        var LocationsView = Backbone.View.extend({

            tagName: "div",

            id: "location-select-container",

            attributes: {
                "class": "tile-container location-select"
            },

            initialize: function () {
                this.collection.on("reset", this.render, this);
            },

            render: function () {
                var self = this;
                self.$el.html('');
                this.collection.each(function (location) {
                    var view = new ItemView({
                        model: location
                    });
                    view.onClick = self.onLocationSelected;
                    self.$el.append(view.render().el);
                });
            },

            onLocationSelected: function () {}
        });
        return LocationsView;
    }
);
