define(['backbone'], function (Backbone) {
    "use strict";
    return Backbone.Collection.extend({
        url:"/batch/bin?customerNumber=", 
        initialize:function(id){
        	this.url += id;
        	return this;
        }
    });
});
