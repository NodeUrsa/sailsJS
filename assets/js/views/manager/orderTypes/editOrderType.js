define(function (require) {

    'use strict';

    // Libraries
    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Marionette          = require('marionette'),
        METRO               = require('metro'),
        syphon              = require('syphon'),
        validation          = require('validation');

    // Models
    var orderTypeModel      = require('models/admin/orderTypeModel');

    var PickupView          = require('widgets/pickupTable/main');

    // Templates
    var template            = require('text!templates/manager/orderTypes/editOrderType.html');

    return Marionette.Layout.extend({

        template: template,

        events: {
            'click button.success'                   : 'save',
            'change [name="expressMixedMode"] input' : 'expressMixedMode_change',
            'change [name="binLocationFlag"]'        : 'changeFieldDependencies',
            'change [name="multiplePackFlag"]'       : 'changeFieldDependencies',
            'change [name="splitFlag"]'              : 'changeFieldDependencies',
//            'change [name="splitFlag"]'              : 'changeSplitFlag',

            'change [name="splitByItems"]'           : 'changeFieldDependencies',
            'change [name="splitBySales"]'           : 'changeFieldDependencies',
            'change [name="splitByCbf"]'             : 'changeFieldDependencies',
            'change [name="combineByItems"]'         : 'changeFieldDependencies',
            'change [name="combineByOrders"]'        : 'changeFieldDependencies',
            'change [name="combineByCbf"]'           : 'changeFieldDependencies'

        },

        fieldDependencies: {
            'binLocationFlag' : 'binLocation',
            'multiplePackFlag': 'numberDocks',
            'splitFlag'       : 'splitRequirment',

            'splitByItems'    : 'splitByItemsNumber',
            'splitBySales'    : 'splitBySalesNumber',
            'splitByCbf'      : 'splitByCbfNumber',
            'combineByItems'  : 'combineByItemsNumber',
            'combineByOrders' : 'combineByOrdersNumber',
            'combineByCbf'    : 'combineByCbfNumber'

        },

        splitFlagDep: ['splitByItems', 'splitBySales', 'splitByCbf'],

        serializeData: function () {
            var model = this.model.toJSON();
            return {model: model};
        },

        initialize: function () {

        },

        onRender: function () {
            var self = this;
//            this.model = this.model.checkCombineFlag(this.model);
            Backbone.Syphon.deserialize(this, this.model.toJSON());

            this.checkAction();
            this.changeType();


            _.each(self.fieldDependencies, function (dep, field) {
                self.changeFieldDependencies({
                    target: "[name='" + field + "']"
                });
            });

            var expressPickupArr,
                willCallPickupArr;
            if(this.model.has('id')){
                switch (this.model.get('orderType')){
                    case 1:
                        willCallPickupArr = this.model.get('cutOffPickup'); expressPickupArr = [];
                        break;
                    case 2:
                        willCallPickupArr = []; expressPickupArr = this.model.get('cutOffPickup');
                        break;
                    case 3:
                        expressPickupArr = []; willCallPickupArr = [];
                        break;
                }
            }else{
                expressPickupArr = []; willCallPickupArr = [];
            }



            this.expressPickupView = new PickupView({pickupArr: expressPickupArr});
            this.$el.find('fieldset[name="ExpressCutOffsPickup"]').append(this.expressPickupView.render().el);

            this.willCallPickupView = new PickupView({pickupArr: willCallPickupArr});
            this.$el.find('fieldset[name="cuttoffPickupWillCall"]').append(this.willCallPickupView.render().el);

        },

        checkAction: function(){
            this.$('[name="orderType"]').attr('disabled', "disabled");
            this.$('[name="orderSubType"]').attr('disabled', "disabled");
        },



        changeType: function (e) {
            var type = Backbone.Syphon.serialize(this, { include: ['orderType'] }).orderType;

            // Enable all fields
            this.enable(['ExpressCutOffsPickup', 'cuttoffPickupWillCall', 'splitFlag', 'willCallGroupingMethod', 'binLocationFlag', 'expressMixedMode', 'mixOrderTypeFlag', 'boxDimensionFlag']);

            // Disable fields depending on order type
            switch (type) {
                case '1':
                    this.$('[name="orderSubType"]').parent().addClass('hideBlock').prev().addClass('hideBlock');
                    this.disable(['ExpressCutOffsPickup', 'splitFlag', 'splitType', 'splitSetTo', 'expressMixedMode', 'mixOrderTypeFlag', 'boxDimensionFlag']);
                    this.willCallGroupingMethod();
                    break;
                case '2':
                    this.disable(['willCallGroupingMethod', 'splitFlag', 'splitType', 'splitSetTo', 'binLocationFlag', 'binLocation', 'cuttoffPickupWillCall']);
                    this.$('[name="orderSubType"]').parent().removeClass('hideBlock').prev().removeClass('hideBlock');
                    break;
                case '3':
                    this.$('[name="orderSubType"]').parent().addClass('hideBlock').prev().addClass('hideBlock');
                    this.disable(['ExpressCutOffsPickup', 'cuttoffPickupWillCall', 'expressMixedMode', 'willCallGroupingMethod', 'mixOrderTypeFlag', 'boxDimensionFlag', 'binLocationFlag', 'binLocation']);
                    break;
            }

            if(this.model.get('managerAccess') == 0){
                this.disable(['shortName', 'name', 'boxDimensionFlag', 'mixOrderTypeFlag', 'pickPackFlag', 'multiplePackFlag', 'freightFlag', 'wrapFlag', 'splitFlag','splitRequirment', 'willCallGroupingMethod', 'binLocationFlag', 'cuttoffPickupWillCall', 'expressMixedMode']);
            }
        },

        willCallGroupingMethod: function(e){

            this.disable('combineNum');
            var checked = this.$('input[name = "combineBy"]:checked');
            if (checked.length != 0) {
                this.enable('combineNum',{focus: true});
            }

        },

        changeFieldDependencies: function (event) {
            var $control = this.$(event.target),
                name     = $control.attr('name');

            if ($control.is('input[type="checkbox"]')) {

                if ($control.is(':checked')) {
                    this.enable(this.fieldDependencies[name], { focus: true });
                } else {
                    this.disable(this.fieldDependencies[name], { removeValue: true });
                }

            } else if ($control.is('input[type="radio"]')) {

                if (this.$('input[type="radio"][name="' + name + '"]:checked').length) {
                    this.enable(this.fieldDependencies[name], { focus: true });
                } else {
                    this.disable(this.fieldDependencies[name], { removeValue: true });
                }
            }
        },

        changeSplitFlag: function(){

            if(this.$('[name="splitFlag"]').is(':checked')){
                for(var i = 0; i < this.splitFlagDep.length; i++){
                    this.$('[name='+ this.splitFlagDep[i] +']').removeAttr('disabled');
                }
//                this.enable(['splitByItems', 'splitBySales', 'splitByCbf']);
            }else{
                this.disable('splitRequirment');
            }
        },

        enable: function (fields, options) {
            var self = this;
            if (_.isArray(fields)) {
                _.each(fields, function (field) {
                    self._enable(field, options);
                });
            } else {
                self._enable(fields, options);
            }
        },

        disable: function (fields, options) {
            var self = this;
            if (_.isArray(fields)) {
                _.each(fields, function (field) {
                    self._disable(field, options);
                });
            } else {
                self._disable(fields, options);
            }
        },

        _enable: function (name, options) {
            var $field = this.$('[name=' + name + ']');

            $field
                .removeClass('disnone')
                .removeAttr('disabled')
                .closest('[data-role="label"]')
                .removeClass('disnone');

            if ($field.is('fieldset')) {
                $field.find('input').removeAttr('disabled');
            }

            if (options && options.focus && !$field.is('input[type="radio"]') && !$field.is('input[type="checkbox"]')) {
                $field.focus();
            }

        },

        _disable: function (name, options) {
            var $field = this.$('[name=' + name + ']');

            if (options && options.hide) {
                $field.addClass('disnone');
            }

            if (options && options.removeValue) {
                if ($field.is('input[type="radio"]')) {
                    this.$('input[type="radio"][name="' + name + '"]').prop('checked', false);
                } else if ($field.is('input') || $field.is('textarea')) {
                    $field.val('');
                }
                $field.trigger('change');
            }

            if (options && options.hideLabel) {
                $field.closest('[data-role="label"]').addClass('disnone');
            }

            if ($field.is('fieldset')) {
                $field.find('input').attr({ 'disabled': 'disabled' });
            }

            $field.attr({ 'disabled': 'disabled' });
        },

        expressMixedMode_change: function () {
            var expGroup1Items = parseInt(+this.$('input[name="expGroup1Items"]').val()),
                expGroup2Items = parseInt(+this.$('input[name="expGroup2Items"]').val()),
                expGroup3Items = parseInt(+this.$('input[name="expGroup3Items"]').val());

            if (expGroup1Items >= expGroup2Items) this.$('input[name="expGroup2Items"]').val(expGroup1Items + 1);

            expGroup2Items = parseInt(+this.$('input[name="expGroup2Items"]').val());

            if (expGroup2Items >= expGroup3Items) this.$('input[name="expGroup3Items"]').val(expGroup2Items + 1);


            this.$('input[name="expGroup4Items"]').val(parseInt(+this.$('input[name="expGroup3Items"]').val(), 10));

            this.$('input[name="expGroup2Items"]').attr({ 'min':expGroup1Items + 1 });
            this.$('input[name="expGroup3Items"]').attr({ 'min':expGroup2Items + 1 });
        },

        checkSubType: function(map){
            if(map.orderType == 1 || map.orderType == 3){
                map.orderSubType = 8;
            }
            return map;
        },



        save: function (e) {
            var self = this;
            this.$('.success').attr('disabled', "disabled");
            setTimeout(function(){
                self.$('.success').removeAttr('disabled');
            }, 2000);

            var map = Backbone.Syphon.serialize(this);
            map.locationId = this.model.get('locationId');

            map = this.model.checkModelAttr(map);

            if(!map){return}

            console.log('map',map);
            if (map.orderSubType == null && map.orderType == '2') {
                app.vent.trigger('adminError',{type: "showMessage", message: "There are all Oreder SubType selected"});
                return;
            }
            map = this.checkSubType(map);

            var cutOffPickupArr;
//                pickupArr = [];
            if(map.orderType == 1){cutOffPickupArr = this.willCallPickupView.collection.toJSON()}
            if(map.orderType == 2){cutOffPickupArr = this.expressPickupView.collection.toJSON()}
            if(map.orderType == 3){cutOffPickupArr = []}

//            for(var i = 0; i < cutOffPickupArr.length; i++){
//                var obj = {};
//                obj.cutoff = moment("Mon Sep 08 2014 " + cutOffPickupArr[i]).format('H:mm:ss');
//                obj.pickup = moment("Mon Sep 08 2014 " + cutOffPickupArr[i]).format('H:mm:ss');
//                obj.locationId = map.locationId;
//                obj.orderType = map.orderType;
//                obj.orderSubType = map.orderSubType;
//
//                pickupArr.push(obj);
//            }

//
            var pickupArr  =_.map(cutOffPickupArr, function(obj, index){
                return {
                    cutoff: moment("Mon Sep 08 2014 " + obj.cutoff).format('H:mm:ss'),
                    pickup: moment("Mon Sep 08 2014 " + obj.pickup).format('H:mm:ss'),
                    locationId: map.locationId,
                    orderType: map.orderType,
                    orderSubType: map.orderSubType
                };
            });

            map.cutOffPickup = pickupArr;


            this.model.save(map, {
                success: function (model, response) {
                    app.vent.trigger('orderType:updated', {});
                    console.log('response', response);
                    $('.window-overlay').click();
                },
                error: function (collection, response) {
                    console.log('response', response);
                },
                wait: true
            });


        }

    });
});