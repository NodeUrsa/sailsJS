define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/orderMatrixModel',
    'text!templates/admin/orderMatrix/addMatrixItem.html'
], function ($, _, Backbone, Marionette, METRO,

        orderTypeModel,
        template) {

    'use strict';

    return Marionette.ItemView.extend({

        template: template,

        events: {
            'click button.success':'save',
            'change select[name="type"]' : 'changeType'
        },
        
        initialize: function () {

        },

        onRender : function () {
            this.unDisplayTypes();
            this.changeType();
        },

        unDisplayTypes: function(){
            var availableArr = this.options.availableOrdersTypes;
            var existArr = this.options.alreadyExistOrdersTypes;

            console.log(availableArr);
            console.log(existArr);
            for(var i = 0; i < availableArr.length; i++){
                this.$('[name="'+availableArr[i].type+'"]').find('[value="'+availableArr[i].value+'"]').addClass('available');
            }
            for(var j = 0; j < existArr.length; j++){
                if(existArr[j].type == "type" && existArr[j].value == 2){continue;}
                this.$('[name="'+existArr[j].type+'"]').find('[value="'+existArr[j].value+'"]').addClass('exist');
            }

            this.$el.find('[name="orderSubType"] option:not(.available)').remove();
            this.$el.find('[name="type"] option:not(.available)').remove();
            this.$el.find('[name="orderSubType"] .exist').remove();
            this.$el.find('[name="type"] .exist').remove();



        },
        
        getMap:function(){
            var type = this.$('select[name="type"]').val();
                var map = {
                    locationId: +this.options.locationId,
                    orderType: parseInt(type),
                    orderSubType: parseInt((type == 2)? this.$('select[name="orderSubType"]').val(): 8),
                    ranking: +this.$('select[name="ranking"]').val()
                };
            return map;
        },

        changeType: function(){
            var type = +this.$('select[name="type"]').val();
            var subTypeCont = this.$('select[name="orderSubType"]').closest('.row');
            if (type == 1 || type == 3) subTypeCont.addClass('hideBlock');
            else subTypeCont.removeClass('hideBlock');
        },


        
        save:function(e){
            var that = this,
                map = this.getMap();

                if( isNaN(map.orderSubType)||isNaN(map.orderType)){
                    var message = "There are all Order SubType selected";
                    app.vent.trigger('adminError',{type: "showMessage", message: message});
                    return;
                }

                var collLength = this.collection.length;

            if(map.ranking > collLength){
                map.ranking = collLength + 1;
                this.saveNewModel(map);
            }
            else{
                this.saveNewModel(map);

                var rank = map.ranking;

                for(var i = rank-1; i < collLength; i++ ){

                    var model = this.collection.at(i),
                        modelRanking = +model.get('ranking');

                    console.log("Ald model");
                    console.log(modelRanking);

                    model.save({ranking: modelRanking+1},{
                        success: function () {},
                        error: function () {
                            console.log("error save order matrix");
                        }
                    });
                }

            }
            $('.window-overlay').click();

        },

        saveNewModel: function(map){
            var that = this;
            this.collection.create(map, {
                success: function () {
                    that.collection.trigger('change');
                    $('.window-overlay').click();
                },
                error: function () {
                    console.log("error save order matrix");
                },
                wait: true
            });
        }

    });
});