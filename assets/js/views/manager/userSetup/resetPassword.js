define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/userModel',
    'text!templates/manager/userSetup/resetPassword.html'
], function ($, _, Backbone, Marionette, METRO,

        Model,
        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success':'save'
        },
        
        initialize: function () {},
        
        serializeData:function(){
        	return {
        		model:this.model.toJSON()
        	};
        },

        onRender : function () {},

        save: function (e) {
            var pass1 = this.$('input[name="newPass1"]').val(),
                pass2 = this.$('input[name="newPass2"]').val();

            if (pass1 !== pass2) {
                var message = 'Passwords do not match';
                app.vent.trigger('adminError', {type: "showMessage", message: message});
                return;
            }

            var role = this.model.get('role');

            if ((role == 3 || role == 5)
                && (pass1.length != 4 || pass1.length != pass1.replace(/\D+/g, "").length)) {
                var message = "password must be four digits";
                app.vent.trigger('adminError', {type: "showMessage", message: message});
                return;
            }

            $.ajax({
                type: "put",
                url: 'user/' + this.model.get('id'),
                data: '{"password":"' + pass1 + '"}',
                success: function () {
                    $('.window-overlay').click();
                }
            });
        }

//        save: function (e) {
//            var pass1 = this.$('input[name="newPass1"]').val(),
//                pass2 = this.$('input[name="newPass2"]').val(),
//                role = this.model.get('role');
//
//            if (pass1 !== pass2) {
//                app.vent.trigger('adminError',{type: "showMessage", message: 'Passwords do not match'});
//                return;
//            }
//
////            if((role == 3 || role == 5) && isNaN(parseInt(pass1))){
//            if(isNaN(pass1)){
//                app.vent.trigger('adminError',{type: "showMessage", message: 'Password must contain only digits!'});
//            	return;
//            }
//
//            this.model.save({
//                password: pass1
//            }, {
//                silent: true,
//                success: function (model, response) {
//					$('.window-overlay').click();
//				}
//            });
//        }
    });
});