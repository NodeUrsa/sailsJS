define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './views/row',

    './pickupCollection',
    'text!./templates/main.html'
], function ($,  _, Backbone, Marionette, METRO,

             Row,
             Collection,
             layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,

        itemViewOptions: function(){return{context: this}},

        itemViewContainer: 'tbody',

        events: {
            'click .icon-file-3': 'addRow',
            'click .icon-remove': 'removeRow'
        },

        initialize: function () {
            var willCallPickupArr =_.map(this.options.pickupArr, function(obj){
                return {
                    cutoff: moment("Mon Sep 08 2014 " + obj.cutoff).format('h:mm a'),
                    pickup: moment("Mon Sep 08 2014 " + obj.pickup).format('h:mm a')
                };
            });

            this.collection = new Collection(willCallPickupArr);
        },

        onRender : function(){
            this.$('[name="cutOfTime"]').timepicker();
            this.$('[name="pickingTime"]').timepicker();
        },

        saveModel: function(model){
            this.model = model;
        },

        addRow: function(){

            var cutOfTimeCont = this.$('[name = "cutOfTime"]'),
                pickingTimeCont = this.$('[name = "pickingTime"]'),
                cutOfTime = cutOfTimeCont.val(),
                pickingTime = pickingTimeCont.val();
            if(cutOfTime == "" || pickingTime == ""){return false;}
            else{
                this.collection.add({
                    cutoff: cutOfTime,
                    pickup: pickingTime
                },{
                    silent: true
                });
                this.render();

                cutOfTimeCont.val("");
                pickingTimeCont.val("");

                var height = this.$('tbody')[0].scrollHeight;
                this.$('tbody').scrollTop(height);
            }
        },

        removeRow: function(){
            this.collection.remove(this.model);
            this.render()
        }


    });
});