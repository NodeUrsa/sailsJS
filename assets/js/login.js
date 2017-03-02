var app = app || {};

(function (requirejs, require) {
    "use strict";

    requirejs.config({
        paths: {
            "templates": '../templates',
            "jquery": 'libs/jquery/jquery-min',
            "jquery_cookie": "libs/jquery.cookie/jquery.cookie",
            "underscore": 'libs/underscore/underscore-min',
            "backbone": 'libs/backbone/backbone-min',
            "text": 'libs/require/text'
        }
    });

    require(
        [
            'backbone',
            'jquery',
            'views/login/locationsView',
            'collections/login/locationCollection',
            'views/login/usersView',
            'collections/login/userCollection',
            'models/userModel',
            'jquery_cookie'
        ],
        function (Backbone, $, LocationsView, Locations, UsersView, Users) {
            var locationSelect, locationLogin, locationIdCookie, locationId, locations, locationsFetched;

            function loadActiveLocations(callback) {
                (new Locations()).fetch({
                    reset: true,
                    success: function (collection) {
                        callback(collection.where({active: true}));
                    }
                });

            }

            locations = new Backbone.Collection();

            locationIdCookie = "locationId";
            locationId = $.cookie(locationIdCookie);

            locationSelect = function () {
                var view;

                view = new LocationsView({
                    collection: locations,
                    el: "#page"
                });
                view.onLocationSelected = function () {
                    var locationId = this.model.get('id');
                    $.cookie(locationIdCookie, locationId);
                    return locationLogin(locationId);
                };

                view.loginFunction = locationLogin;
                loadActiveLocations(function (activeLocations) {
                    locations.reset(activeLocations);
                });
            };

            locationLogin = function (locationId) {
                var users, view;
                users = new Users();
                if (!locations.length && !locationsFetched) {
                    loadActiveLocations(function (activeLocations) {
                        locations.reset(activeLocations);
                        locationsFetched = true;
                        locationLogin(locationId);
                    });
                    return;
                }
                users.location = locations.findWhere({id: parseInt(locationId, 10)});
                if (!users.location) {
                    $.removeCookie(locationIdCookie);
                    return locationSelect();
                }
                $.cookie(locationIdCookie, locationId, { expires: 36500 });

                view = new UsersView({
                    el: "#page",
                    collection: users,
                    events: {
                        "click #change-location": function () {
                            $.removeCookie(locationIdCookie);
                            return locationSelect();
                        }
                    }
                });
                users.fetch({reset: true});
            };

            if (locationId) {
                locationLogin(locationId);
            } else {
                locationSelect();
            }
        }
    );
}(requirejs, require));
