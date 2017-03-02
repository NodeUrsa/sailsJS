define(['backbone'], function (Backbone) {
    "use strict";
	
    var itemModel = Backbone.Model.extend({
        defaults: {
            id: null,
            partNo: null,
            description: null,
            locator: null,
            box: null,
            pieces: null,
            allocated: null,
            picked: null,
			status: ''
        }
    });
    return itemModel;
});