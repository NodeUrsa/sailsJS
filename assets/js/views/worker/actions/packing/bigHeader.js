define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/worker/actions/packing/bigHeader.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel'
        },
        
        initialize:function(){
        	console.log(this.model.toJSON());
        },
        
        serializeData:function(){
        	console.log('big header', this.model.toJSON());
        	return {
        		model : this.model.toJSON()
        	};
        },
        
        /*yes: function (e) {
        	$('.window-overlay').click();
        	app.vent.trigger('worker:packing:finish');
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }*/
    });
});