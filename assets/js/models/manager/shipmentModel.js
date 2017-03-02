define(['backbone'], function (Backbone) {
    "use strict";
	
    var ShipmentModel = Backbone.Model.extend({
        defaults: {
            id: null,
            carrier: null,
            container: null,
            shipperID: null,
            shipDate: null,
            etaDate: null,
            estecDT: null,
            intDT: null,
            invAmt: null,
            BOQty: null,
            BOAmt: null,
            selected: null
        }
    });
    return ShipmentModel;
});