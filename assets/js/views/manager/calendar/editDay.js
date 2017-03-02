define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'metro',

        './editDayRow',
        './emptyRow',
        'text!templates/manager/calendar/editDay.html',
        'collections/manager/calendarCollection'
        ], function ($, _, Backbone, Marionette, METRO,

                Row,
                EmptyRow,
                template,
                Collection) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,
        itemView: Row,
        emptyView: EmptyRow,
        itemViewContainer: 'tbody',
        days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        fullDays: ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],

        events: {
            'click button.success':'save',
            'change input[type="checkbox"]': 'countEmployee'
        },

        serializeData:function(){
            return {date : {
                day:this.date.date(),
                weekday:this.days[this.date.weekday()]
            }};
        },

        initialize: function () {
            this.date = this.options.day;
            this.collection = new Collection();
            this.collection.fetch({data: {day: this.date.format()}}, {
                success: function(){console.log("success get calendar data")},
                error: function(){alert("error get calendar data")}
            });
        },

        onRender : function () {
            this.countEmployee();
        },

        changeAssignment: function(e){
            var id = +$(e.target).attr('name');
            for(var i = 0; i < this.changedModelsArr.length; i++){
                if(this.changedModelsArr[i] == id) {return false}
            }
            this.changedModelsArr.push(id);
        },

        save:function(e){
            var that = this;
            var arrToSave = _.filter(this.collection.models, function(model){
             return (model.changedAttributes());
            });
            arrToSave = _.map(arrToSave, function(model){
                return model.toJSON();
            });



//            debugger;
            if(arrToSave.length != 0) {
                $.ajax({
                    url: 'calendar/setWorkersByDay',
//                url: 'calendar/workers',
                    type: 'post',
                    data: JSON.stringify({workers: arrToSave, day: that.date.format() }),
                    success: function(){
                        console.log("success save calendar data")
                    },
                    error: function(){alert("error save calendar data")}
                });
            }

            $('.window-overlay').click();


        },

        countEmployee: function(){
            var eeOnValue = this.$('input[type="checkbox"]:checked').length,
                eeOffValue = Math.abs(eeOnValue - this.collection.length);
            this.$('#eeOn').text(eeOnValue).next().text(eeOffValue);

        }
    })
});