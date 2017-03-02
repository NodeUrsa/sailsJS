define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!./../templates/item.html',

    'moment'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'tr',

        template: rowTemplate,

        serializeData:function(){
            var model = this.model.toJSON();
            if(this.model.dataToRender){
                model = this.model.dataToRender(model);
            }
            return model;
        },

        initialize: function(){

            this.template = _.template(rowTemplate, this.options.context.model.toJSON());




//            this.serializeData = function(){
//                var model = this.model.toJSON();
//
//                switch (this.options.context.model.get('name')){
//                    case 'security':
//                        model = this.serSecurity(model);
//                        break;
//                    case 'location':
//                        model = this.serLocation(model);
//                        break;
//                    case 'callCenter':
//                        model = this.serCallCenter(model);
//                        break;
//                    default :
//                        model = this.model.toJSON();
//                        break;
//                }
//
//                return model;}
        },

        events: {
            'click'   : 'onClick'
        },

        onClick: function (e) {
            if(this.options.context.model.has('callback')){
                this.options.context.model.get('callback')(this.model)
            }


            if(this.options.context.model.get('radio')){
                var checkbox = this.$('td input[type="radio"]'),
                    tr = $(e.target).closest('tr');
                checkbox.prop('checked', 'checked');
                tr.addClass('selected').siblings().removeClass('selected');
            }

        }

//        serSecurity: function(model){
//            var equipmentTypes = {
//                '1': 'Workstation',
//                '2': 'Tablet',
//                '3': 'Mobile Cell Phone',
//                '4': 'Other'
//            },
//                status = {
//                    '0': 'Inactive',
//                    '1': 'Active'
//                };
//            model.equipmentType = equipmentTypes[model.equipmentType];
//            model.status = status[model.status];
//            return model;
//        },
//
//        serLocation: function(model){
//            model.activateLocation = (typeof model.activateLocation !== "undefined" && model.activateLocation) ? "active" : "inactive";
//            model.activateSystem = (typeof model.activateSystem !== "undefined" && model.activateLocation) ? "active" : "inactive";
//            return model;
//        },
//
//        serCallCenter: function(model){
//            var types = {
//                '1': 'Will Call',
//                '2': 'Express',
//                '3': 'Truck'
//            },
//            subTypes = {
//                '0': 'UPS',
//                '1': 'Fedex',
//                '2': 'OnTrac',
//                '3': 'LoneStar',
//                '4': 'SpeeDee',
//                '5': 'BBExpress',
//                '6': 'MGC',
//                '7': 'Others',
//                '8': ""
//            },
//            orderStages = {
//                '1' : 'Picking',
//                '2' : 'Packing',
//                '3' : 'Wrapping',
//                '4' : 'Ship Ready',
//                '5' : 'Cancelled'
//            };
//            model.user = (model.user != null)? model.user.firstName + " " + model.user.lastName :"";
//            model.orderType = types[model.orderType];
//            model.orderSubType = subTypes[model.orderSubType];
//            model.orderStage = orderStages[model.orderStage];
//            model.orderDate = moment(model.orderDate).format('MM/DD/YYYY');
//            return model;
//        }

    });
});