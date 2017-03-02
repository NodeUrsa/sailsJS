define(['backbone', 'models/admin/securityModel'], function (Backbone, Security) {
    "use strict";
    var Security = Backbone.Collection.extend({
        model: Security,
        comparator: 'location',
        url: "/equipment"
    });
    return Security;
});
