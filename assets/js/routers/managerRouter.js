define(
        [
         'backbone',
         'views/manager/main',
         'views/manager/home'
         ],
         function (
                 Backbone,
                 Main,
                 Home
         ) {
            "use strict";
            var ManagerRouter;


            ManagerRouter = Backbone.Router.extend({
                routes: {
                    'home' : 'home',
                    "admin/:param"  : "renderPage"
                },

                home: function(){
                    var home = new Home();
                    home.render();
                },

                renderPage : function(param){
                    var mainView = new Main({'section':param});
                    mainView.render();
                }
            });
            return ManagerRouter;
        }
);