define(function (require) {

    'use strict';

    // Libraries
    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Marionette          = require('marionette');

    return Backbone.Model.extend({

        defaults: {
//            id: null,
//            orderType: '1',
//            orderSubType: '0'
        },

        validation: {
            // name: {
            //     required: true
            // },
            // shortName: {
            //     required: true
            // },
            // branchId: {
            //     required: true,
            //     pattern: 'digits'
            // },
            // address: {
            //     required: true
            // },
            // city: {
            //     required: true
            // },
            // state: {
            //     required: true
            // },
            // zip: {
            //     required: true
            // },
            // opsStartHour: {
            //     required: true
            // },
            // opsEndHour: {
            //     required: true
            // },
            // docks: {
            //     required: true,
            //     pattern: 'digits'
            // }
        },

        checkModelAttr: function(map){

            var attrArr = ['binLocation', 'combineNum', 'locationId', 'orderSubType', 'referenceId', 'combineBy', 'combineNum', 'splitType', 'splitSetTo', 'numberDocks', 'startAfterNumbOrder', 'binLocation', 'avgPieces', 'numberItems', 'expGroup1Items', 'expGroup1Orders','expGroup1Qdr', 'expGroup2Items', 'expGroup2Orders', 'expGroup2Qdr', 'expGroup3Items', 'expGroup3Orders', 'expGroup3Qdr', 'expGroup4Items', 'expGroup4Orders', 'expGroup4Qdr', 'combineFlag', 'upToNumberOrders', 'upToNumberPieces', 'upToVolume'],
                requireAttrArr = ['orderType', 'name', 'shortName'];
            for(var i = 0; i < requireAttrArr.length; i++ ){
                if(map[requireAttrArr[i]] == ""){
                    app.vent.trigger('adminError',{type: "showMessage", message: "Type, Description and Short Name fields can't be empty"});
                    return false;
                }
            }
            map.orderType = +map.orderType;
            for(var j = 0; j < attrArr.length; j++ ){
                if((map[attrArr[j]] && map[attrArr[j]] == "") || !map[attrArr[j]] ){map[attrArr[j]] = null}
                else{map[attrArr[j]] = +map[attrArr[j]]}
            }
            var attrArr2 = ['combineByCbfNumber', 'combineByItemsNumber', 'combineByOrdersNumber', 'splitByCbfNumber', 'splitByItemsNumber', 'splitBySalesNumber'];
            for(var k = 0; k < attrArr2.length; k++){
                if(map[attrArr2[k]] == ""){map[attrArr2[k]] = null}
                else{map[attrArr2[k]] = + map[attrArr2[k]]}
            }
            return map;
        },

        checkCombineFlag: function(model){
            if (model.has('id')) {
                var combineBy =  model.get('combineBy');
                var splitType =  model.get('splitType');
                if(combineBy != null){model.set('combineBy', combineBy + "")}
                if(splitType != null){model.set('splitType', splitType + "")}
            }
            return model;
        }




    });

});