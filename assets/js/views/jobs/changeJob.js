define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/jobs/changeJob.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.ItemView.extend({

        template: template,

        events: {
            'click button.success':'start',
            'click button.error':'stop'
//            'change select[name="type"]' : 'changeType'
        },
        serializeData: function(){
            return this.options;
        },

        initialize: function () {

        },


        getMap:function(){
                var map = {
                    job: this.options.name,
                    time: encodeURI(this.$('select[name="time"]').val())
                };
            return map;
        },



        start: function(){
            var map = this.getMap();

            $.ajax({
                type: "get",
                url: 'job/start',
                data: map,
                success: function(){$('.window-overlay').click();},
                error: function(){alert("error save Job")}
            });
        },

        stop: function(){

            $.ajax({
                type: "get",
                url: 'job/stop',
                data: {job:  this.options.name},
                success: function(){$('.window-overlay').click();},
                error: function(){alert("error save Job")}
            });
        }


    });
});