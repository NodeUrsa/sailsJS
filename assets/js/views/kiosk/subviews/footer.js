define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/kiosk/footer.html'
], function ($, _, Backbone, Marionette, METRO, layoutTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        template: layoutTemplate,

        events: {
            'click #button_prev' : 'onClickPrev',
            'click #button_next' : 'onClickNext',
            'click #button_home' : 'onClickHome'
        },

        initialize: function () {
            app.vent.on('kiosk:validation:footer:next', this.onValidateNext, this);
            app.vent.on('kiosk:validation:footer:prev', this.onValidatePrev, this);
        },

        serializeData: function () {
            return {
                phase: this.options.ctx.phase
            };
        },

        switchPhase: function (e, options) {
            if ($(e.target).hasClass('disabled')) {
                return false;
            }
            if(this.options.ctx.phase == 3 && options.next == true) {
                var object = app.reqres.request("sendSignature");
                if(object.next){this.goToNextPage(object);}
                else{alert("can't save signature")}
            }
            else{
                this.goToNextPage(options);
            }
        },

//        switchPhase: function (e, options) {
//            if ($(e.target).hasClass('disabled')) {
//                return false;
//            }
//            if(this.options.ctx.phase == 3 && options.next == true) {
//                app.vent.trigger('kiosk:validation:sendSignature');
//            }
//            else{
//                this.goToNextPage(options);
//            }
//        },

        goToNextPage: function(options){
            if (options.next) {
                this.options.ctx.phase++;
            } else {
                this.options.ctx.phase--;
            }
            Backbone.history.navigate('phase/' + this.options.ctx.phase, { trigger: true });
        },

        onClickPrev: function (e) {
            this.switchPhase(e, {next: false});
        },

        onClickNext: function (e) {
            this.switchPhase(e, {next: true});
        },

        onClickHome: function (e) {
            Backbone.history.navigate('home', { trigger: true });
        },

        onValidateNext: function (enabled) {
            if (enabled) {
                this.$('#button_next').removeClass('disabled');
            } else {
                this.$('#button_next').addClass('disabled');
            }
        },

        onValidatePrev: function (enabled) {
            if (enabled) {
                this.$('#button_prev').removeClass('disabled');
            } else {
                this.$('#button_prev').addClass('disabled');
            }
        }

    });

});