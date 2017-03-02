define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'syphon',
        'metro',
        'timepicker',

        'widgets/fillRateTable/main',
        'models/admin/locationModel',
        'text!templates/manager/locations/editLocation.html'
        ], function ($, _, Backbone, Marionette, syphon, METRO, timepicker,

                FillRateView,
                Model,
                template
                ) {

    'use strict';

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
                app.vent.trigger('adminError',{type: "showMessage", message: "Enter correct value from 0 to 100"});
                return;
            }
            first.val(firstVal + "%");
            second.val((100-firstVal) + "%");
        },

        save:function(e){
            var that = this;

            var map = Backbone.Syphon.serialize(this);

            map = this.model.checkAttributes(map, this);
            if(!map){return}
            map.fillRate = this.fillRateView.getCollArr();


            this.collection.get(this.model.get('id')).save(map, {
                success: function (model, response) {
                    console.log('response', response);
                    $('.window-overlay').click();
                },
                error: function (model, response) {
                    console.log('response', response);
                },
                wait: true
            });
        },

        onDestroy: function () {
            Backbone.Validation.unbind(this);
        }

    });
});