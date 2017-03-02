define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
    	
    	getInfo:function(options){
    		this.url = '/api/info';
    		return this;
    	}
    });
});
