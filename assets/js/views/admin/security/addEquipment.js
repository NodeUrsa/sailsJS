define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/securityModel',
    'text!templates/admin/security/addEquipment.html'
], function ($, _, Backbone, Marionette, METRO,

        securityModel,
        template) {

    'use strict';

    return Marionette.ItemView.extend({

        template: template,

        events: {
            'click button.success':'save'
//            'change select[name="type"]' : 'changeType'
        },

        initialize: function () {

        },

        onRender : function () {
//            this.changeType();
//            this.unDisplayTypes();
        },

        unDisplayTypes: function(){
            var arr = this.options.unDisplayTypesArr;

            console.log(arr);
            for(var i = 0; i < arr.length; i++){
                this.$('[name="'+arr[i].type+'"]').find('[value="'+arr[i].value+'"]').remove();
            }
        },

        getMap:function(){
                var map = {
                    locationId: +this.options.locationId,
                    equipmentType: +this.$('select[name="equipmentType"]').val(),
                    description: this.$('input[name="description"]').val(),
                    status: +this.$('select[name="status"]').val()
                };
            return map;
        },

//        changeType: function(){
//            var type = +this.$('select[name="type"]').val();
//            var subTypeCont = this.$('select[name="orderSubType"]').closest('.row');
//            if (type == 2 || type == 3) subTypeCont.addClass('hideBlock');
//            else subTypeCont.removeClass('hideBlock');
//        },



        save:function(e){
            var map = this.getMap();
            this.saveNewModel(map);
        },

        saveNewModel: function(map){
            var that = this;
            this.collection.create(map, {
                success: function () {
//                    that.collection.trigger('change');
                    $('.window-overlay').click();
                },
                error: function () {
                    console.log("error save new equipment");
                },
                wait: true
            });
        }

    });
});