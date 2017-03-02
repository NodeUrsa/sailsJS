define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/batchModel',

    'text!templates/picking/layout.html',
    'libs/jquery-ui/jquery.widget.min',
    'libs/jquery/jquery.cookie',
    'libs/signature_pad/signature_pad.min',
    'metro_ui'
], function ($, _, Backbone, Marionette, METRO,
        BatchModel,
        
        layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        el: $('#page'),

        template: layoutTemplate,

        regions: {
            header   : '.panel_header',
            content  : '.data-content',
            footer   : '.panel_footer'
        },

        initialize: function () {
            this.batch = new BatchModel();
            this.batch.fetch();

            app.vent.on('scanner:data', this.onScan, this);
        },

        onRender: function () {
            app.commands.execute('scanner:on');
        },

        onScan: function (dataString) {
            var data     = dataString.split(' '),
                item     = data[0],
                quantity = data[1];
            console.log('scanned item: ' + item, 'quantity: ' + quantity);
        }

    });
  
});