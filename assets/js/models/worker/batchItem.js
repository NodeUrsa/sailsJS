define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
        //urlRoot: '/batch'
    	
    	pick:function(options){
    		this.url = '/worker/pick/'+options.id+ '?quantity='+options.quantity;
    		return this;
    	},
    	
    	pack:function(options){
    		this.url = '/worker/pack/'+options.id+ '?quantity='+options.quantity;
    		return this;
    	}
    });
});
