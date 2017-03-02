define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    'text!templates/manager/locations/location_table.html'
], function ($, _, Backbone, Marionette, METRO,

        RowView,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,
        
        tagName:'table',
        className:'table striped hovered',

        itemView: RowView,

        itemViewContainer: 'tbody'
    });
});