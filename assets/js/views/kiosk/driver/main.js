define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/kiosk/page3_driverinfo.html',
    '../subviews/printForm'
], function ($, _, Backbone, Marionette, METRO, layoutTemplate, PrintForm) {

    'use strict';

    return Marionette.ItemView.extend({

        template: layoutTemplate,

        events: {
            'click #button_signature_clear'  : 'clearSignature',
            'click #accept_terms'            : 'onClickAcceptTerms',
            'keyup input[data-required=text]': 'validateForm'
        },

        initialize: function () {
            console.log("Driver options", this.options);

            var that = this;
            _.bindAll(this, 'onSignatureDraw');

            app.reqres.setHandler("sendSignature", function(){
                return that.sendSignature();
            });
        },

        serializeData: function () {
            console.log("orderModel", this.collection.first().toJSON());
            return {
                order: this.collection.first().toJSON()
            };
        },

        clearSignature: function () {
            this.signature.clear();
            this.validateForm();
        },

        validateForm: function () {
            var valid = false;
            if (this.$('#accept_terms').prop('checked') && this.signature.points.length) {
                valid = true;
            }
            this.$('input[data-required=text]').each(function () {
                if (!$(this).val()) {
                    valid = false;
                }
            });
            app.vent.trigger('kiosk:validation:footer:next', valid);
        },

        onRender: function () {
            this.signature = new SignaturePad(this.$('canvas').get(0), {
                onEnd: this.onSignatureDraw
            });
        },

        sendSignature: function(){
            var that = this,
                isSuccess = true;

            var driverName = this.$('[name="driverName"]').val(),
                driverSignature = this.signature.toDataURL ();

            var data = [];
            console.log(this.collection.toJSON());
            for(var i = 0; i < this.collection.length; i++){
                if(this.collection.at(i).get('checked')){
                    data.push({
                        customerNumber: this.collection.at(i).toJSON().customerNumber,
                        deliverNum: this.collection.at(i).toJSON().deliveryNum,
                        orderNumber: this.collection.at(i).toJSON().orderNumber
                    });

                }
            }

            $.ajax({
                url:"kiosk/driverinfo",
                type: 'post',
                async: false,
                data: {
                    driverName: driverName,
                    driverSignature: driverSignature,
                    orders: data
                },
                success: function(){
                    console.log("send signature success");
                },
                error: function(){isSuccess = false}
//                error: function(){isSuccess = true}                   //hardcode
            });

            return {next: isSuccess};
        },

        onClickAcceptTerms: function (e) {
            this.validateForm();
        },

        onSignatureDraw: function () {
            this.validateForm();
        },

        onPrint: function () {
            var formView = new PrintForm({collection: this.collection});
//            $("body").append("<div id="divToPrint" style="position: absolute"></div>")
            $(document).find('body').append(formView.$el);
//            this.$el.prepend(formView.$el);
//            formView.render();
//            window.print();
//            Backbone.history.navigate('home', { trigger: true });
        }

    });

});