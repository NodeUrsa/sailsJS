define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',

    'text!templates/kiosk/page2_order.html'
], function ($, _, Backbone, Marionette, METRO,

        RowView,

        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: RowView,

        itemViewContainer: 'tbody',

        collectionEvents: {
            'change': 'onCheck'
        },

        events: {
            'click thead input[type="checkbox"]': 'onCheckAll'
        },

        initialize: function () {
        },

        onRender: function () {
            app.commands.execute('kiosk:resize:content', true);
        },

        onCheck: function () {
            app.vent.trigger('kiosk:validation:footer:next', this.collection.where({ checked: true }).length);
        },

        onCheckAll: function (e) {
            var state = e.target.checked;
            this.$('td input[type=checkbox]:enabled').each(function() {
                this.checked = state;
            });
            this.collection.each(function (model) {
                if(model.get('orderStage') == "Ship Ready"){
                    model.set({ checked: state }, { silent: true });
                }
                else{
                    model.set({ checked: false }, { silent: true });
                }
            });
            this.onCheck();
        }

    });

});