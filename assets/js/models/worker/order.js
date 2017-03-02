define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({

        initialize : function(options){
        	this.url = '/batch/order/'+options.id;
        	return this;
        }
    });
});