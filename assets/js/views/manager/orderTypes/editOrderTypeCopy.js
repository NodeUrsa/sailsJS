define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/orderTypeModel',
    'text!templates/manager/orderTypes/editOrderType.html'
], function ($, _, Backbone, Marionette, METRO,

             orderTypeModel,
             template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,

        expressMixedMode:'fieldset[name="expressMixedMode"] input, fieldset[name="expressMixedMode"] select',

        events: {
            'click button.success':'save',
//            'change select[name="type"]' : 'changeType',
            'change input[name="splitFlag"]' : 'changeSplit',
//            'change input[name="activateMixMode"]' : 'activateMixMode',
            'change [name="expressMixedMode"] input' : 'expressMixedMode_change',
            'change input[name="multiplePacking"]' : 'multiplePackingChange'

        },

        serializeData:function(){
            console.log(this.model.toJSON());
            return {model:this.model.toJSON()};
        },

        initialize: function () {
            console.log('options', this.options);
            if(!this.model)
                this.model = new orderTypeModel();
            console.log('model', this.model.toJSON());
        },

        onRender : function () {
            this.checkManagerAccess();
            this.changeType();
            this.changeSplit();
            this.multiplePackingChange();
//            this.expressMixedMode_change();
        },

        checkManagerAccess:function(){
            if(!this.model.get('managerAccess')){
                this.$('input:not([name="activatedOrderType"]), select').attr({'disabled':'disabled'});
            }
        },

        getMap:function(){
            var orderType = this.$('select[name="type"]').val();

            var map = {
                'shortName' : this.$('input[name="shortName"]').val(),
                'freightFlag' : this.$('input[name="freight"]').is(':checked'),
                'splitFlag' : this.$('input[name="splitFlag"]').is(':checked'),
                'locationId' : this.options.locationId,
                'name' : this.$('input[name="description"]').val(),
                'orderType': orderType,
                'pickPackFlag' : this.$('input[name="pickPack"]').is(':checked'),
                'wrapFlag': this.$('input[name="wrap"]').is(':checked'),
                'multiplePackFlag': this.$('input[name="multiplePacking"]').is(':checked'),
                'upToNumbOrders': this.$('input[name="upToNumbOrders"]').val(),
                'numberDocks': this.$('input[name="numberDocks"]').val(),
                'startAfterNumbOrder' : this.$('input[name="startAfterNumbOrder"]').is(':checked'),
                'activated': true,
                'activateSystem': this.$('input[name="activateSystem"]').is(':checked')
            };

            if(this.$('select[name="orderSubType"]').is(':enabled')){
                map.orderSubType = this.$('select[name="orderSubType"]').val();
            }

            var combine = this.$('input[name="combineFlag"]').is(':checked');

            if(map.orderType == '1'){
                map.combineFlag = this.$('input[name="combineFlag"]').is(':checked');
                map.binLocationFlag = this.$('input[name="binsFlag"]').is(':checked');
                map.binLocation = this.$('input[name="binsAvailable"]').val();
            }

            if(map.splitFlag){
                map.splitType = this.$('input[name="requirment"]:checked').val();
                map.splitSetTo = this.$('input[name="splitNum"]').val();
            }

            if(this.$('input[name="activateMixMode"]').is(':enabled')){
                map.expressMixModeFlag = this.$('input[name="activateMixMode"]').is(':checked');
                map.mixOrderTypeFlag = this.$('input[name="mixOrderTypeFlag"]').is(':checked');
                map.boxDimensionFlag = this.$('input[name="boxDimensionFlag"]').is(':checked');
                if(map.expressMixModeFlag){
                    map = _.extend(map, {
                        expGroup1Items: this.$('input[name="expGroup1Items"]').val(),
                        expGroup1Orders: this.$('input[name="expGroup1Orders"]').val(),
                        expGroup1Maxvolume: this.$('input[name="expGroup1Maxvolume"]').val(),
                        /*expGroup1Qdr: this.$('input[name="expGroup1Qdr"]').val(),*/

                        expGroup2Items: this.$('input[name="expGroup2Items"]').val(),
                        expGroup2Orders: this.$('input[name="expGroup2Orders"]').val(),
                        expGroup2Maxvolume: this.$('input[name="expGroup2Maxvolume"]').val(),
                        expGroup2Qdr: this.$('input[name="expGroup2Qdr"]').val(),

                        expGroup3Items: this.$('input[name="expGroup3Items"]').val(),
                        expGroup3Orders: this.$('input[name="expGroup3Orders"]').val(),
                        expGroup3Maxvolume: this.$('input[name="expGroup3Maxvolume"]').val(),
                        expGroup3Qdr: this.$('input[name="expGroup3Qdr"]').val(),

                        expGroup4Items: this.$('input[name="expGroup4Items"]').val(),
                        expGroup4Orders: this.$('input[name="expGroup4Orders"]').val(),
                        expGroup4Maxvolume: this.$('input[name="expGroup4Maxvolume"]').val(),
                        expGroup4Qdr: this.$('input[name="expGroup4Qdr"]').val()
                    });
                }
            }
            return map;
        },

        save:function(e){
            var map = this.getMap();

            console.log(map);

            //validation
            if(!map.name||!map.shortName){
                app.vent.trigger('adminError',{type: "showMessage", message: "Description and Short Name can't be empty"});

            }
            else {
                //validation end

                console.log('map', map);

                if (!this.model.has('id')) {
                    this.collection.create(map, {
                        success: function (collection, response) {
                            console.log('response', response);
                            $('.window-overlay').click();
                        },
                        error: function (collection, response) {
                            console.log('response', response);
                        },
                        wait: true
                    });
                }
                else {
                    this.model.save(map, {
                        success: function (collection, response) {
                            console.log('response', response);
                            $('.window-overlay').click();
                        },
                        error: function (collection, response) {
                            console.log('response', response);
                        },
                        wait: true
                    });
                }
            }

        },

        changeType : function(e){
            var willCallTypeDisable = '[name="shipRequirement"], [name="splitFlag"], [name="expressMixedMode"], [name="mixOrderTypeFlag"], [name="boxDimensionFlag"]';
            var expressTypeDisable = '[name="willCallGroupingMethod"], [name="binsFlag"], [name="binsAvailable"]';
            var truckTypeDisable = '[name="expressMixedMode"], [name="mixOrderTypeFlag"], [name="boxDimensionFlag"]';
//            var expressType = '[name="expressCarrier"], [name="activateMixMode"],input[name="mixOrderTypeFlag"],input[name="boxDimensionFlag"]'+', '+this.expressMixedMode;
//            var willCallType = '[name="binsFlag"], [name="binsAvailable"]';
            //[name="combineFlag"], [name="upToNumbOrders"], [name="binsFlag"], [name="binsAvailable"]'

            if( this.model.get('orderType') == 1) this.disable(willCallTypeDisable);
            if( this.model.get('orderType') == 2) this.disable(expressTypeDisable);
            if( this.model.get('orderType') == 3) this.disable(truckTypeDisable);

//            else this.enable(expressType);

//            if(this.$('[name="type"]').val() != '1') this.disable(willCallType);
//            else this.enable(willCallType);
        },

        changeSplit : function(e){
            if(!this.$('input[name="splitFlag"]').is(':checked')) this.disable('[name="requirment"], [name="splitNum"]');
            else this.enable('[name="requirment"], [name="splitNum"]');
        },

        multiplePackingChange: function (e) {
            if(!this.$('input[name="multiplePacking"]').is(':checked')) {
                this.disable('[name="numberDocks"]');
                this.$('[name="numberDocks"]').val("0");
            }
            else this.enable('[name="numberDocks"]');
        },

        activateMixMode : function(e){
            if(!this.$('input[name="activateMixMode"]').is(':checked'))
                this.disable(this.expressMixedMode);
            else this.enable(this.expressMixedMode);
        },

        enable : function(elements){
            this.$(elements).removeAttr('disabled');
        },

        disable : function(elements){
            this.$(elements).attr({'disabled':'disabled'});
        },

        expressMixedMode_change : function(){
            var expGroup1Items = parseInt(+this.$('input[name="expGroup1Items"]').val()),
                expGroup2Items = parseInt(+this.$('input[name="expGroup2Items"]').val()),
                expGroup3Items = parseInt(+this.$('input[name="expGroup3Items"]').val());
            if(expGroup1Items >= expGroup2Items ) this.$('input[name="expGroup2Items"]').val(expGroup1Items+1);

            expGroup2Items = parseInt(+this.$('input[name="expGroup2Items"]').val());

            if(expGroup2Items >= expGroup3Items ) this.$('input[name="expGroup3Items"]').val(expGroup2Items+1);


            this.$('input[name="expGroup4Items"]').val(+parseInt(this.$('input[name="expGroup3Items"]').val()));

            this.$('input[name="expGroup2Items"]').attr({'min':expGroup1Items+1});
            this.$('input[name="expGroup3Items"]').attr({'min':expGroup2Items+1});
        }
    });
});