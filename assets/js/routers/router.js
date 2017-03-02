// Filename: router.js
define([
    'jquery',
    'backbone',
    'routers/homeRouter',
    'routers/managerRouter',
    'routers/adminRouter',
    'routers/kioskRouter',
    'routers/userRouter'
], function ($, Backbone, HomeRouter, ManagerRouter, AdminRouter, KioskRouter, userRouter) {
    "use strict";

    var initialize, Routers = {};

    Routers.AppRouter = Backbone.Router.extend({
        routes: {
            //default router
            '*action': 'defaultAction'
        }
    });

    initialize = function (isManager, isAdmin) {

        var app_router = new Routers.AppRouter();
        Routers.HomeRouter = new HomeRouter();
        Routers.kioskRouter = new KioskRouter();
        Routers.userRouter = userRouter;

        /** default router **/
        app_router.on('route:defaultAction', function (actions) {
            window.location.hash = "home";
        });

        //Routers.kioskRouter.initialize();
        
        console.log(isManager);

        if (isManager) {
            Routers.managerRouter = new ManagerRouter();
        }

        if (isAdmin) {
            Routers.adminRouter = new AdminRouter();
        }

        Routers.userRouter.initialize();

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
