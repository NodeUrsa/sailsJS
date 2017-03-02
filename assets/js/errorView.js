define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/error/showMessage.html',
    'text!templates/error/checkEquipment.html'

], function ($, _, Backbone, Marionette, METRO,

             showMessage,
             enterEquipment) {

    'use strict';

    return Marionette.ItemView.extend({

        n:0,
        errorCode: 0,

        serializeData:function(){
            var message = this.options.message;
            return {message: message};
        },

        initialize: function(options){

            if(options){
                if (options.code){
                    switch (options.code){
                        case 1:
                            this.template = enterEquipment;
                            break;
                        case 2:
                            this.template = showMessage;
                            break;
                    }
                }
                else {
                    switch (options.type) {
                        case "showMessage":
                            this.template = showMessage;
                            break;

                    }
                }
            }

//          if(options.type == "checkAccess"){
//              this.template = checkEquipment;
//          }else if {
//              this.template = accessDenied;
//          }
        },
        events: {
            'keyup input' : 'keyUp',
            'click .success' : 'sendToken',
            'click .delete' : 'retry',
//            'click button.btn-close' : 'cancel'
            'click .readMessage' : 'readMessage'
        },

        readMessage: function(){
            $(document).find('#errorModal').remove();
            if(this.options.code){
                switch (this.options.code){
                    case 1:

                        break;
                    case 2:
                        window.location.reload();
                        break;
                    case 3:

                        break;
                    default:

                }
            }

        },

        retry: function(){
            this.render();
        },

        keyUp: function(e){
            var target = this.$(e.target);
            var value = target.val();
            var keyCode = e.keyCode;
            if(keyCode = 8 && value == ""){
                if(this.n == 0) {this.n++}
                else {target.prev().val("").focus(); this.n = 0;}
            }
            if(value.length == 2) target.next().val("").focus();

        },

        sendToken: function (e) {
            var self = this,
                inputArr = this.$('.input input'),
                val1 = inputArr.eq(0).val(),
                val2 = inputArr.eq(1).val(),
                val3 = inputArr.eq(2).val();
            if (val1 && val2 && val3) var token = val1 + val2 + val3;
            else {
                app.vent.trigger("adminError", {type: "showMessage", message: "There are empty fields"});
                return;
            }

            $.ajax({
                type: "get",
                url: "/equipment/apply/" + token,
                success: function () {
                    $(document).find('#equipmentModal').remove();
                },
                error: function (respons) {

                    var message = JSON.parse(respons.responseText).error.text;
                    app.vent.trigger("adminError", {type: "showMessage", message: message});
//                    var html = "<div class='form-line center'>"+
//                        "<div class='input'>"+
//                        "<h3 class='offset0'> " + JSON.parse(respons.responseText).error.text + "</h3>"+
//                        "</div>"+
//                        "</div>"+
//                        "<div class='row center'>"+
//                        "<button class='large delete'>Retry</button>"+
//                        "</div>";
//                    self.$('#checkEquipment').html(html);

                }
            });
        }


    });
});