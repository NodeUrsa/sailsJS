define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/worker/actions/alert.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,

        serializeData:function(){
            return {
                text:this.options.text,
                buttons: this.options.buttons || null
            };
        },
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel'
        },
        
        yes: function (e) {
        	$('.window-overlay').click();
            if(this.options.action){
                this.options.action();
            }
        },

        cancel:function(){
            if(this.options.onCancel){
                this.options.onCancel();
            }
            else{
                $('.window-overlay').click();
            }
            //console.log('cancel');
        },

        destroy:function(){
            console.log('destroy');
            if(this.options.onClose){
                this.options.onClose();
            }
            else if(this.options.action){
                this.options.action();
            }
        }
    });
});