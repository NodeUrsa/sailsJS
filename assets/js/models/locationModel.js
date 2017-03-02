define(['backbone'], function (Backbone) {
    "use strict";
    var LocationModel = Backbone.Model.extend({
        defaults: {
            id: null,
            name: null,
            referenceId: null,
            shippingGates: null,
            receivingGates: null,
            willCallBins: null,
            active: true
        }
    });
    return LocationModel;
});
