define([
	'backbone'
], function (Backbone, OrderModel) {
    "use strict";
    return Backbone.Collection.extend({
        url: "/kiosk/orders",

        parse: function(response){
            var results;
            results = this.checkBinLocation(response);
            return results;
        },

        checkBinLocation: function(modelArr){
            return _.map(modelArr, function(model){
                if(model.binLocation.slice(-1) == "-"){
                    model.binLocation = model.binLocation.slice(0, -1);
                }
                return model;
            });
        }
    });
});
