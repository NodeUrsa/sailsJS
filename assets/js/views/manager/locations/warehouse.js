define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './warehouse_row',
    'text!templates/manager/locations/other_warehouse.html'
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