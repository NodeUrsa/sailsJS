define(['backbone', './fillRateModel'], function (Backbone, model) {
    "use strict";
    var Collection = Backbone.Collection.extend({
        model: model,
        comparator: 'level',
        url: "/"
    });
    return Collection;
});
