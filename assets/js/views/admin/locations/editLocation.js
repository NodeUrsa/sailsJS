define(function (require) {

    'use strict';

    // Libraries
    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Marionette          = require('marionette'),
        METRO               = require('metro'),
        timepicker          = require('timepicker'),
        syphon              = require('syphon'),
        validation          = require('validation');

    // Models
    var Model               = require('models/admin/locationModel');

    //FillRateView
    var FillRateView          = require('widgets/fillRateTable/main');

    // Templates
    var template            = require('text!templates/admin/locations/editLocation.html');


    return Marionette.Layout.extend({

        template: template,

        events: {
            'click button.success':'save',
             'blur input[name="pickPercentageQueue"], [name="packPercentageQueue"]': 'checkPercentage'
        },

        serializeData: function () {
            var model = this.model.toJSON();
            if (this.model.has('id')){model = this.model.serializeAttr(this.model.toJSON())}
            return {model: model};
        },

        initialize: function () {
            if (!this.model) {
                this.model = new Model();
            }
            Backbone.Validation.bind(this, {
                valid: function (view, attr) {
                    view.$('[name=' + attr + ']').removeClass('field-has-error');
                },
                invalid: function (view, attr, error) {
                    view.$('[name=' + attr + ']').addClass('field-has-error');
                }
            });
        },

        onRender : function () {
            if(!this.model.has('id')){this.model.set('fillRate', [])}


            this.fillRateView = new FillRateView({fillRateArr: this.model.toJSON().fillRate});
            this.$('div[name="fillRateTable"]').html(this.fillRateView.render().el);


            this.$el.find('[name="opsStartHour"]').timepicker();
            this.$el.find('[name="opsEndHour"]').timepicker();

        },


        checkPercentage: function(e){
            var first = $(e.target),
                inputArr = first.closest('.balanceQueue').find('input'),
                second = inputArr.not(first),
                firstVal = first.val().replace(/\D+/g,"");
            if(firstVal == ""){first.val("");second.val("");return;}
            if(isNaN(firstVal)||firstVal<0||firstVal>100){
                first.val("");second.val("");
                var message = "Enter correct value from 0 to 100";
                app.vent.trigger('adminError',{type: "showMessage", message: message});
                return;
            }
            first.val(firstVal + "%");
            second.val((100-firstVal) + "%");
        },

        save: function (e) {
            var that = this;
            var map = Backbone.Syphon.serialize(this);

            map = this.model.checkAttributes(map, this);
            if(!map){return}
            map.fillRate = this.fillRateView.getCollArr();
            this.model.set(map);


            if (!this.model.isValid(true)) {
                return;
            }

            if (!this.model.has('id')) {
                this.collection.create(map, {
                    success: function (collection, response) {
                        console.log('response', response);
                        that.collection.fetch();
                        that.collection.trigger("change");
                        $('.window-overlay').click();
                    },
                    error: function (collection, response) {
                        console.log('response', response);
                    },
                    wait: true
                });
            } else {
                this.model.save(map, {
                    success: function (model, response) {
                        console.log('response', response);
                        that.collection.fetch();
                        $('.window-overlay').click();
                    },
                    error: function (model, response) {
                        console.log('response', response);
                    },
                    wait: true
                });
            }
        },


        onDestroy: function () {
            Backbone.Validation.unbind(this);
        }



    });
});