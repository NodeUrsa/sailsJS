define(function (require) {

    'use strict';

    // Libraries
    var Backbone      = require('backbone');

    // Models
    var locationModel = require('models/admin/locationModel');

    return Backbone.Collection.extend({

        model: locationModel,
        comparator: 'name',
        url: '/location'
        
    });

});
