define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var FrameView   = require('./views/frame');

    return Marionette.CollectionView.extend({

        itemView: FrameView,

        className: function () {
            var classes = [
                'accordion',
                'span3',
                'margin10'
            ];

            if (this.options.style.marker) {
                classes.push('with-marker');
            }

            if (this.options.style.place) {
                classes.push(this.options.style.place);
            }
            return classes.join(' ');
        },

        initialize: function () {
            this.options.style = this.options.style || {};
        },

        onRender: function () {
            this.assignDataAttributes();
        },

        assignDataAttributes: function () {
            this.$el.attr('data-role', 'accordion');
            if (this.options.style.closeany) {
                this.$el.attr('data-closeany', 'true');
            }
        }

    });

});
