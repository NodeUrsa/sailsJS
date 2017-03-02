define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/manager/monitoring/transferRow.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate){

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,
        
        serializeData:function(){
            if(!this.model.has('batch')){
                this.model.set('batch', {})
            }
            var model = this.model.toJSON();
            var orderType = this.model.get('batch').orderType;
            var type = {
              '1': 'WillCall',
              '2': 'Express',
              '3': 'Truck'
            };
            if(model.batch.orderType){
                model.batch.orderType = type[model.batch.orderType];
                if(model.batch.orderType == undefined){
                    model.batch.orderType = orderType;
                }
            }

            return model;
        },

        events: {
            'click'   : 'onClick'
        },

        onClick: function (e){
            var checkbox = this.$('td input[type="radio"]'),
                tr = $(e.target).closest('tr');

            if(!checkbox.is(':checked')){
                checkbox.prop('checked', 'checked');
                tr.addClass('selected').siblings().removeClass('selected');
            }
        }
    });
});