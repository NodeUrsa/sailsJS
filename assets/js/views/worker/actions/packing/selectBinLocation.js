define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/worker/binLocation',
    'text!templates/worker/actions/packing/selectBinLocation.html'
], function ($, _, Backbone, Marionette, METRO,

        binLocation,
        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel',
            'click button.clear-fields' : 'clear',
            'click .rings-buttons-box .tile':'num',
            'click .buttons-box .tile':'let'
        },

        num:function(e){
            var input = this.$('input[name="nums"]'),
                num = $(e.currentTarget).text(),
                val = input.val() + num;

            input.val(val);
        },

        let:function(e){
            this.$('input[name="let"]').val($(e.currentTarget).text());
        },
        
        yes: function (e) {
            console.log(this.model.toJSON());
            if (!this.$('input[name="nums"]').val()) return;
            var model = new binLocation(),
                map = {
                'masterBatchId':this.options.orderModel.get('masterBatchId'),
                'deliveryNum':this.model.get('deliveryNum'),
                'customerNumber':this.model.get('customerNumber'),
                'binLocation':this.$('input[name="nums"]').val() + '-' + this.$('input[name="let"]').val()
            };
            model.assign(map).fetch({
                success:function(model, response){
                    $('.window-overlay').click();
                    app.vent.trigger('worker:packing:bin_location:assigned');
                },
                error:function(model, response){
                    //console.log('response error', response);
                    $('.window-overlay').click();
                    app.vent.trigger('worker:packing:bin_location:assign:accept', map);
                }
            });
        },

        clear:function(){
            this.$('input').val('');
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});