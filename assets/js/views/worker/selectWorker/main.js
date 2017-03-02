define([
        'jquery',
        'jquery_cookie',
        'underscore',
        'backbone',
        'marionette',
        'metro',

        './locations',
        './users',
        '../login',
        'collections/admin/locationCollection',
        'collections/worker/workers',
        'text!templates/worker/selectWorker/main.html',
        'metro_ui'
        ], function ($, cookie, _, Backbone, Marionette, METRO,

                Locations,
                Users,
                Login,
                LocationCollection,
                UserCollection,
                layoutTemplate,
                metro_ui) {

    'use strict';

    return Marionette.Layout.extend({

        //el: $('#page'),
        
        regions:{
            content : '.content'
        },

        template: layoutTemplate,
        
        initialize: function () {
        	app.vent.on('worker:selectLocation', this.renderUsers, this);
            app.vent.on('worker:selectUser', this.login, this);
        	
        	var locationId = $.cookie('locationId');
        	//if(locationId){
        		this.users    = new UserCollection();
                this.users.fetch(/*{data:{'locationId':locationId}}*/);
        	//}
        	//else{
        	//	this.collection = new LocationCollection();
             //   this.collection.fetch();
        	//}
        },
        
        onRender:function(){
        	//if($.cookie('locationId')){
        		this.content.show(new Users({parent:this, users:this.users, 
        			collection:this.users}));
        	//}
        	//else{
        	//	this.content.show(new Locations({parent:this, collection:this.collection}));
        	//}
        },
        
        changeLocation:function(){
        	if(!this.collection){
        		this.collection = new LocationCollection();
                this.collection.fetch();
        	}
        	this.render();
        },
        
        renderUsers:function(options){
            this.users    = new UserCollection();
            this.users.fetch({data:{'locationId':options.locationId}});
            this.content.show(new Users({parent:this, users:this.users,collection:this.users}));
        },
        
        login:function(options){
            var model = this.users.findWhere({'id' : options.userId});
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">Login</span>',
                width: 360,
                height: 360,
                padding: 20,
                content: new Login({model:model}).render().el
            });
        }
    });
});