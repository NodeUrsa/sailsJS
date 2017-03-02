define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
    	
    	assign:function(options){
    		this.url = '/batch/bin?masterBatchId='+options.masterBatchId+
    					'&deliveryNum='+options.deliveryNum+
    					'&binLocation='+options.binLocation +
    					'&customerNumber='+options.customerNumber +
    					 ((options.force)?'&force='+options.force : '');
    		return this;
    	}
    });
});
