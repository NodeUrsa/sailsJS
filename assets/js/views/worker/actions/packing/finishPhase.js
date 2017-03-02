define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/worker/actions/packing/finishPhase.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel'
        },
        
        yes: function (e) {
        	$('.window-overlay').click();
        	app.vent.trigger('worker:packing:summary');
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});