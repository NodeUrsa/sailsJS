define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/worker/binLocation',
    'text!templates/worker/actions/packing/selectQuantity.html'
], function ($, _, Backbone, Marionette, METRO,

        binLocation,
        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel',
            'click button.clear-input' : 'clear',
            'click .rings-buttons-box .tile':'num'
        },

        num:function(e){
            var input = this.$('input[name="nums"]'),
                num = $(e.currentTarget).text(),
                val = input.val() + num;

            input.val(val);
        },
        
        yes: function (e) {
            $('.window-overlay').click();
            var quantity = parseInt(this.$('input[name="nums"]').val());
            if(!quantity){
            	this.playError();
            	return;
            }
            app.vent.trigger('scanner:data', {'box':false, 'pn':this.options.pn, 'quantity':quantity});
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        },

        clear:function(){
        	this.$('input[name="nums"]').val('');
        },

        playError:function(){
            $('#alarm')[0].pause();
            $('#alarm')[0].currentTime = 0;
            $('#alarm')[0].play();
        }
    });
});