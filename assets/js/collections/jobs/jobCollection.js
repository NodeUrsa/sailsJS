define(function (require) {

    'use strict';

    // Libraries
    var Backbone      = require('backbone');

    // Models
    var jobModel = require('models/jobs/jobModel');

    return Backbone.Collection.extend({

        model: jobModel,
        comparator: 'name',
        url: '/job/list'
    });

});
