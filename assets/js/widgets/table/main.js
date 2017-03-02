define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var ItemView   = require('./views/item');

    // Templates
    var layout      = require('text!./templates/layout.html');

    return Marionette.CompositeView.extend({

        tagName: 'table',

        template: layout,

        itemView: ItemView,

        itemViewContainer: 'tbody'

    });

});
