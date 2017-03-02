define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
        urlRoot: '/batch/preview',

        finish:function(id){
        	this.url = '/batch/finish/'+id;
        	return this;
        },

        transferAccept:function(id){
        	this.url = '/batch/transfer/accept?masterBatchId='+id;
        	return this;
        }
    });
});
