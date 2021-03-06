define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/worker/actions/picking/pause.html'
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
        	//app.vent.trigger('worker:picking:pause');
            //app.router.navigate('', {trigger: true});
            location.reload();
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});