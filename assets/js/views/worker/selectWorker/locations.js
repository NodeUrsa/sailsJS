define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './locationItem',
    'text!templates/worker/selectWorker/locations.html'
], function ($, _, Backbone, Marionette, METRO,

        RowView,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: RowView,

        itemViewContainer: '.items',

        events: {
            'click header .btn': 'headerButtonPress'
        },

        initialize: function () {},

        onRender : function () {},
        
        headerButtonPress : function (e) {
            
        }
    });
});