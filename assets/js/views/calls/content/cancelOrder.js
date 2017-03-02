define([
    'jquery',
    'jquery_ui',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'collections/manager/transferCollection',
    'text!templates/calls/content/cancelOrder.html'
], function ($, jqueryUi,_, Backbone, Marionette, METRO,

             Collection,
             template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,

        events: {
//            'click button.save':'process',
//            'click button.delete':'cancel'
        },

        serializeData:function(){
        },

        initialize: function () {
//            var that = this;
//            this.collection = new Collection();
//            this.collection.fetch({
//                data:{'locationId':app.me.get('locationId')},
////                data:{locationId: 46},
//                success: function(collection){
//                    var model = that.collection.get(that.model.get('user').id);
//                    if(model){that.collection.remove(model)}
//
//                },
//                error: function(){alert("can't get workers")}
//            });
//
////            this.listenTo(this.collection, 'change', this.render, this);

        },

        onRender : function () {}

//        cancel: function(){
//            $('.window-overlay').click();
//        }

//        process: function(){
//            var userId = this.$('[type="radio"]:checked').attr('data-id');
//            if(!userId){
//                app.vent.trigger('adminError',{type: "showMessage", message: "Please, select user"});
//                return;
//            }
//            var logOff = this.$('[name="logOff"]').is(':checked'),
//                masterBatchId = this.model.get('batchNumber'),
//                lastName = this.collection.get(userId).get('lastName'),
//                firstName = this.collection.get(userId).get('firstName');
//
//
//            $.ajax({
//                url: "/batch/transfer?userId=" + userId + "&masterBatchId=" + masterBatchId + "&logOff=" + logOff,
//                type: "get",
//                success: function(){
//                    app.vent.trigger('batch:worker:change', {lastName: lastName, firstName: firstName, batchNumber: masterBatchId});
//                    $('.transfer').addClass('hideBlock');
//                    $('.window-overlay').click()
//                },
//                error: function(){
//                    app.vent.trigger('adminError',{type: "showMessage", message: "can't save"});
//                }
//            });
//        }

    });
});