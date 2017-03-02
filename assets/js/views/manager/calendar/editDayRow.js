define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/calendar/editDayRow.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,
        
        initialize:function(){

        },

        events: {
            'click input[type="checkbox"]': 'changeOnOffFlag',
            'click input[type="radio"]':'changeAssignment'
        },

        changeOnOffFlag: function(e){
            this.model.set('onOffFlag', $(e.currentTarget).is(':checked'));
            console.log(this.model.get('onOffFlag'));
        },

        changeAssignment: function(e){
            this.model.set('assignment', + $(e.currentTarget).attr('data-role'));
            console.log(this.model.get('assignment'));

        }


    });
});