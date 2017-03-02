define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
        urlRoot: '/batch/items',
        
        finish:function(id){
        	this.url = '/batch/finish/'+id;
        	return this;
        },

        getBox:function(id){
        	this.url = '/batch/box/'+id;
        	return this;
        },

        assign:function(options){
            this.url = '/batch/box/assign/?boxLabel='+options.label+'&itemNumber='+options.pn+'&quantity='+options.qty+'&type='+options.type+
            '&orderNumber='+options.orderNumber+'&deliveryNum='+options.deliveryNum;
            return this;
        },

        remove:function(options){
            this.url = '/batch/box/remove/?boxLabel='+options.label+'&itemNumber='+options.pn+'&quantity='+options.qty;
            return this;
        },

        removeAll:function(id){
            this.url = '/batch/box/remove/all?boxLabel='+id;
            return this;
        },

        compliteOrder:function(id){
            this.url = '/batch/complete/order/'+id;
            return this;
        }
    });
});
