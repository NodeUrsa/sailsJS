define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'moment',
    /*'libs/jquery_ui_custom/jquery-ui.custom.min',*/
    'fullcalendar',

    './editDay',
//    'collections/admin/userCollection',
    'text!templates/manager/calendar/main.html'
], function ($, _, Backbone, Marionette, METRO,moment,/*ui_custom,*/Fullcalendar,

        EditDay,
//        Collection,
        layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        template: layoutTemplate,
        className:'data-content',
        
        events: {},

        initialize: function () {
//            this.collection  = new Collection();
//            this.collection.fetch({data:{'locationId':this.options.locationId}});
        },

        onRender : function () {
//            console.log('render',moment());
            var that = this;
            this.$('.fullcalendar').fullCalendar({
                header: {
                    left: 'prev, next',
                    center: 'title',
                    right: 'basicWeek,month',
                    ignoreTimezone: false
                },
                dayClick: function(day) { 
                    that.dayView(day);
                },
                titleFormat:'MMMM',
                defaultView:'basicWeek',
                selectable: true,
                selectHelper: true,
                editable: true,
                aspectRatio: 2.2
            });
            
            setTimeout(function(){
                that.$('.fullcalendar').fullCalendar( 'changeView', 'month' );
            },50);
        },
        
        dayView:function(day){
            console.log('a day has been clicked!',day.format());
            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '',
                width: 900,
                height: 550,
                padding: 10,
                content: new EditDay({day:day, locationId: this.options.locationId}).render().el
            });
        }
    });
});