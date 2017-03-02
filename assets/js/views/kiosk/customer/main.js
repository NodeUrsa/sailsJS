define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',

    'text!templates/kiosk/page1_customer.html'
], function ($, _, Backbone, Marionette, METRO,

        RowView,

        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: RowView,

        itemViewContainer: 'tbody',

        events: {
            'click .kiosk_customer_search_bar [data-keyword]': 'onSelectFilter'
        },

        initialize: function () {
            this.filter = '';
        },

        serializeData: function () {
            return {
                filter: this.filter,
                keywords: [
                    {'keyword': '', 'label': 'ALL'},            {'keyword': 'abc', 'label': 'A-C'},             {'keyword': 'def', 'label': 'D-F'},
                    {'keyword': 'ghi', 'label': 'G-I'},         {'keyword': 'jkl', 'label': 'J-L'},             {'keyword': 'mno', 'label': 'M-O'},
                    {'keyword': 'pqr', 'label': 'P-R'},         {'keyword': 'stu', 'label': 'S-U'},             {'keyword': 'vwxyz', 'label': 'V-Z'}
                ]
            };
        },

        onRender: function () {
            app.commands.execute('kiosk:resize:content', true);
        },

        onSelectFilter: function () {
            var self = this,
                $button = $(event.target);

            this.filter = $button.data('keyword');
            this.collection = this.options.ctx.data.customer.collection.filter(function (item) {
                if (!self.filter) {
                    return true;
                } else {
                    for (var i = 0; i < self.filter.length; i++) {
                        if (self.filter[i] == item.get('customerName')[0].toLowerCase()) {
                            return true;
                        }
                    }
                }
                return false;
            });
            this.collection = new Backbone.Collection(this.collection);
            this.render();
        }

    });

});