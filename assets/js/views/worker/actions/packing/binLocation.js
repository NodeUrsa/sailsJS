define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'collections/worker/binLocations',
    './binLocationRow',

    'models/worker/binLocation',
    'text!templates/worker/actions/packing/binLocation.html'
], function ($, _, Backbone, Marionette, METRO,

        Collection,
        Row,
        binLocation,
        template) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,
        itemView:Row,
        itemViewContainer:'tbody',
        
        events: {
            'click button.success' : 'existing',
            'click button.new' : 'new',
            'click button.danger' : 'cancel'
        },

        initialize:function(options){},

        onRender:function(){
            console.log('bin locations', this.collection.length);

            if(this.collection.length)
                this.$('tbody tr:first-child td input').attr({'checked':'checked'});
        },
        
        existing: function (e) {
            var model = new binLocation(),
                bl = this.$('input:checked').attr('val'),
                map = {
                    'masterBatchId':this.options.orderModel.get('masterBatchId'),
                    'deliveryNum':this.model.get('deliveryNum'),
                    'customerNumber':this.model.get('customerNumber'),
                    'binLocation':bl
                };

            if(!bl) return;
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

        'new': function (e) {
            $('.window-overlay').click();
            app.vent.trigger('worker:packing:binLocation:new');
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});