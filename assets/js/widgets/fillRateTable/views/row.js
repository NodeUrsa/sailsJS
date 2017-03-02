define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!./../templates/row.html'
], function ($, _, Backbone, Marionette, METRO,


             rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        serializeData:function(){
            return this.model.toJSON();
        },

        events: {
//            'click'   : 'onClick'
        }

//        onClick: function (e) {
//            var checkbox = this.$('td input[type="radio"]'),
//                tr = $(e.target).closest('tr');
//            checkbox.prop('checked', 'checked');
//            tr.addClass('selected').siblings().removeClass('selected');
//        }



    });
});