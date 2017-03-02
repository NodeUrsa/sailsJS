define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'metro',

        'models/admin/userModel',
        'text!templates/admin/userSetup/editUser.html'
        ], function ($, _, Backbone, Marionette, METRO,

                userModel,
                template) {

    'use strict';

    return Marionette.Layout.extend({
        
        className:'modal',

        template: template,

        events: {
            'click button.success':'save'
        },

        serializeData:function(){
            return {model : this.model.toJSON()};
        },

        initialize: function () {
            if(!this.model)
                this.model = new userModel();
        },

        onRender : function () {
            this.$el.find('[name="hoursStart"]').timepicker();
            this.$el.find('[name="hoursEnd"]').timepicker();

            this.disabledFields();
        },

        disabledFields: function(){
            if(this.model.has('id')){
                this.$('[name="userName"]').attr('disabled', 'disabled');
            }
        },

        save:function(e){
            var map = {
                locationId: this.options.locationId,
                userName: this.$('input[name="userName"]').val(),
                firstName: this.$('input[name="firstName"]').val(),
                lastName: this.$('input[name="lastName"]').val(),
                active: this.$('input[name="active"]').is(':checked'),
                operationStartHour: this.$('input[name="hoursStart"]').val(),
                operationEndHour: this.$('input[name="hoursEnd"]').val(),
                role: +this.$('select[name="type"]').val()
            };


            var roleStr = this.$('select[name="type"]').val();

//            map = this.model.checkModelAttr(map);

            if(!map.userName||!map.firstName||!map.lastName){
                var message = "First Name, Last Name and UserName field can't be blank";
                app.vent.trigger('adminError',{type: "showMessage", message: message});
                return;
            }
            var password = (this.$('input[name="password"]').val() == this.$('input[name="password2"]').val())?
                this.$('input[name="password"]').val() : false;

            if(!password && !this.model.has('id')){
                var message = 'password not confirmed';
                app.vent.trigger('adminError',{type: "showMessage", message: message});
                return;
            }

            if((!this.model.has('id') && (roleStr == "3" || roleStr == "5"))
            		&& (password.length != 4 || password.length != password.replace(/\D+/g,"").length)){
                var message = "password must be four digits";
                app.vent.trigger('adminError',{type: "showMessage", message: message});
            }
            else {



                console.log('map', map);

                if (!this.model.has('id')) {
                    map.password = password;
                    this.collection.create(map, {
                        success: function (collection, response) {
                            console.log('response', response);
                            $('.window-overlay').click();
                        },
                        error: function (collection, response) {
                            app.vent.trigger('adminError',{type: "showMessage", message: JSON.parse(response.responseText).error.text});
                        },
                        wait: true
                    });
                }
                else {
                    this.model.save(map, {
                        success: function (model, response) {
                            console.log('response', response);
                            app.vent.trigger('user:updated', {userId:model.get('id')});
                            $('.window-overlay').click();
                        },
                        error: function (model, response) {
                            app.vent.trigger('adminError',{type: "showMessage", message: JSON.parse(response.responseText).error.text});
                        },
                        wait: true
                    });
                }
            }
        }
    });
});