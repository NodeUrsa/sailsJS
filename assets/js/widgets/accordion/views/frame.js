define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Templates
    var layout      = require('text!../templates/frame.html');

    return Marionette.Layout.extend({

        className: 'accordion-frame',

        template: layout,

        regions: {
            data: '.content'
        },

        onRender: function () {
            var content = this.model.get('content');
            if (content.type === 'view' && _.isObject(content)) {
                this.data.show(content.data);
            }
        }

    });

});
