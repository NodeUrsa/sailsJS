define(
    [
        'backbone',
        'underscore',
        'views/login/userView',
        'text!templates/login/users.html!strip',
        'metro_ui'
    ],
    function (Backbone, Underscore, UserView, template) {
        "use strict";

        var UsersView = Backbone.View.extend({
            tagName: "div",
            id: "location-select-container",
            attributes: {
                "class": "tile-container location-login"
            },

            initialize: function () {
                this.locationId = this.collection.location.get("id");
                this.template = Underscore.template(template);
                this.collection.on("reset", this.render, this);
            },

            render: function () {
                var self = this;
                self.$el.html(this.template());
                self.$el.find("#user-list-filter").buttongroup({
                    click: function (btn, on) {
                        if (!(btn instanceof jQuery.Event)) {
                            self.displayUsers(
                                btn.attr("data-start"),
                                btn.attr("data-end")
                            );
                        }
                    }
                });
                self.displayUsers('a', 'z');
            },

            locationId: null,

            displayUsers: function (low, high) {
                var filtered, $list, locationId = this.locationId;
                filtered = this.collection.filter(function (user) {
                    var first = String(user.get("nameFirst")).toLowerCase(),
                        last = String(user.get("nameLast")).toLowerCase(),
                        pass;
                    pass = user.get('enabled');
                    pass = pass && user.get('location').id === locationId;
                    pass = pass &&
                        ((
                            first.substr(0, low.length) >= low &&
                            first.substr(0, high.length) <= high
                        ) || (
                            last.substr(0, low.length) >= low &&
                            last.substr(0, high.length) <= high
                        ));
                    return pass;
                });
                $list = this.$el.find("#user-list");
                $list.empty();
                Underscore.forEach(filtered, function (user) {
                    var view = new UserView({
                        model: user
                    });
                    $list.append(view.render().el);
                });

            }
        });
        return UsersView;
    }
);
