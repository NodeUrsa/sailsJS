var app = app || {};

define(
    [
        'backbone',
        'views/index'
    ],
    function (Backbone, IndexView) {
        "use strict";
        var indexView, HomeRouter;

        HomeRouter = Backbone.Router.extend({
            routes: {
                "home": "index"
            },

            index: function () {
                var self = this;
                if (app.loggingIn) {
                    window.setTimeout(function () {
                        self.index();
                    }, 100);
                } else {
                    indexView = indexView || new IndexView({
                        model: app.currentUser
                    });

                    indexView.render();
                }
            }
        });
        return HomeRouter;
    }
);
