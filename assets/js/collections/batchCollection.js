define([
	'backbone', 
	'models/batchModel'
], function (Backbone, BatchModel) {
    "use strict";
    var batchCollection = Backbone.Collection.extend({
        model: BatchModel,
        url: "/json/batch.json"
    });
    return batchCollection;
});
