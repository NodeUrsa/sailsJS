define(['backbone', 'moment', './pickupModel'], function (Backbone,moment, model) {
    "use strict";
    var Collection = Backbone.Collection.extend({
        model: model,
        comparator: function(model){
            return +moment("Mon Sep 08 2014 " + model.get('cutoff')).format('Hmm');
        },
        url: "/"
    });
    return Collection;
});
