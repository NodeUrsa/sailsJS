// Filename: userRouter.js
define([
    'jquery',
    'backbone',
    'views/common/footerView',
    'views/user/homeView',
    'views/user/willCallActivitiesView'
], function ($, Backbone, FooterView, UserHomeView, UserWillCallActivitiesView) {
    "use strict";

    var initialize, footerView, UserRouter = Backbone.Router.extend({
        routes: {

            'user/willcall_activities': 'onWillCallActivities',
            //default user action
            'user/': 'defaultAction'
        }
    });

    initialize = function () {

        var app_router = new UserRouter('');

        /** default router **/
        app_router.on('route:defaultAction', function (actions) {

            var userHomeView = new UserHomeView();
        });

        app_router.on('route:onWillCallActivities', function () {
            var userWillCallActivitiesView = new UserWillCallActivitiesView();
            userWillCallActivitiesView.render();

        });

        footerView = new FooterView();
    };
    return {
        initialize: initialize
    };
});
