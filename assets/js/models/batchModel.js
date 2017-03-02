define(['backbone', 'models/itemModel', 'collections/orderCollection'], function (Backbone, ItemModel, OrderCollection) {
    "use strict";

    var BatchModel = Backbone.Model.extend({
        defaults: {
            id: null,
			orders : null
        },
		parse: function(response) {
			return	{
				id : response.id,
				orders: new OrderCollection(response.orders)
			};
		},
		clone: function() {
			var result = new BatchModel();
			
			result.set({
				id: this.id,
				orders: new OrderCollection(this.get('orders').toJSON())
			});
			
			return result;
		},
		urlRoot : '/json/batch.json'
	});

	return BatchModel;
});
