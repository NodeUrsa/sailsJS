define([
	'backbone', 
	'models/itemModel'
], function (Backbone, ItemModel) {
    "use strict";
    var itemCollection = Backbone.Collection.extend({
        model: ItemModel
    });
    return itemCollection;
});
