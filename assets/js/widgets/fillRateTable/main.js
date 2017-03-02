define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './views/row',

    './fillRateCollection',
    'text!./templates/main.html'
], function ($,  _, Backbone, Marionette, METRO,

             Row,
             Collection,
             layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,


        itemViewContainer: 'tbody',

        events: {
            'click .icon-file-3': 'addRow',
            'click .icon-remove': 'removeRow',
            'blur input[type="text"]': 'inputPressKey',
            'blur tbody td': 'lastRowBlur'
        },

        initialize: function (){
            var fillRate = this.options.fillRateArr,
                corrArr = [];

            for (var i = 0; i < fillRate.length; i++){
                var obj = {};
                if(fillRate[i].level == fillRate.length){
                    obj.fillRatePercentage = ">" + fillRate[i].fillRatePercentage + "%";
                }else{
                    obj.fillRatePercentage = "<" + fillRate[i].fillRatePercentage + "%";
                }
                obj.level = fillRate[i].level;
                obj.incomingAllocPercentage =(!(fillRate[i].incomingAllocPercentage == null))? fillRate[i].incomingAllocPercentage + "%" : "";
                obj.outgoingAllocPercentage = (!(fillRate[i].outgoingAllocPercentage == null))? fillRate[i].outgoingAllocPercentage + "%": "";

                corrArr.push(obj);

            }


//            var corrArr = _.map(this.options.fillRateArr, function(obj, index, arr){
//                if(obj.level == arr.length){
//                    obj.fillRatePercentage = ">" + obj.fillRatePercentage + "%";
//                }else{
//                    obj.fillRatePercentage = "<" + obj.fillRatePercentage + "%";
//                }
//                obj.incomingAllocPercentage =(!(obj.incomingAllocPercentage == null))? obj.incomingAllocPercentage + "%" : "";
//                obj.outgoingAllocPercentage = (!(obj.outgoingAllocPercentage == null))? obj.outgoingAllocPercentage + "%": "";
//                return obj;
//            });

            this.collection = new Collection(corrArr);

//            if(this.options.locationId == undefined){this.locationId = app.me.get('locationId')}
//            else{this.locationId = this.options.locationId}
        },

        onRender : function(){

            var arr = this.$('tbody tr').last().find('[child="3"], [child="4"]').attr('contenteditable', 'true');
        },

        getCollArr: function(){
            var collArr = this.collection.toJSON();
            var readyArr = _.map(collArr, function(obj){
                obj.fillRatePercentage = + obj.fillRatePercentage.replace(/\D+/g,"");
                obj.incomingAllocPercentage =(!obj.incomingAllocPercentage == "")? + obj.incomingAllocPercentage.replace(/\D+/g,""): null;
                obj.outgoingAllocPercentage =(!obj.outgoingAllocPercentage == "")? + obj.outgoingAllocPercentage.replace(/\D+/g,""): null;
                return obj;
            });
            return readyArr;
        },

        inputPressKey: function(e){
            var target = $(e.target),
                targetVal = target.val().replace(/\D+/g,""),
                inputArr = target.closest('.fillRateTable').find('input'),
                isValid = this.validateVal(targetVal);
            switch(target.attr('name')) {
                case "fillRatePercentage":
                var minVal = this.$('tbody tr').last().find('[child="2"]').text().replace(/\D+/g,"");
                    if(!isValid || +minVal >= +targetVal){target.val("")}
                    else{target.val(targetVal)}
                    break;
                case "incomingAllocPercentage":
                    if(!isValid || targetVal == ""){target.val("");inputArr.eq(2).val("")}
                    else{target.val(targetVal);inputArr.eq(2).val(100 - targetVal)}
                    break;
                case "outgoingAllocPercentage":
                    if(!isValid || targetVal == ""){target.val("");inputArr.eq(1).val("")}
                    else{target.next('input');inputArr.eq(1).val(100 - targetVal)}
                    break;
            }
        },

        validateVal: function(targetVal){
            if(isNaN(targetVal)||targetVal<0||targetVal>100){
                var message = "Enter correct value from 0 to 100";
                app.vent.trigger('adminError',{type: "showMessage", message: message});
                return false;
            }
            return true;
        },

        addRow: function(){
            var that = this,
                fillRatePercentage = this.$('input[name="fillRatePercentage"]').val(),
                incomingAllocPercentage = this.$('input[name="incomingAllocPercentage"]').val(),
                outgoingAllocPercentage = this.$('input[name="outgoingAllocPercentage"]').val();
            if(fillRatePercentage == ""||incomingAllocPercentage==""||outgoingAllocPercentage==""){return false}
            else{
                var trArr = this.$('tbody tr');
                if(trArr.length == 0){
                    this.collection.add([{
//                        locationId: this.locationId,
                        level: 1,
                        fillRatePercentage: "<" + fillRatePercentage + "%",
                        incomingAllocPercentage: incomingAllocPercentage + "%",
                        outgoingAllocPercentage: outgoingAllocPercentage + "%"
                    }, {
                        level: 2,
//                        locationId: this.locationId,
                        fillRatePercentage: ">" + fillRatePercentage + "%",
//                        incomingAllocPercentage: incomingAllocPercentage + "%",
                        incomingAllocPercentage: "",
//                        outgoingAllocPercentage: outgoingAllocPercentage + "%"
                        outgoingAllocPercentage: ""
                    }],{
                        silent: true
                    });
                    this.$('.fillRateTable').find('input').val("");
                    this.render();
                }
                else{
                    var lastRow = trArr.eq(trArr.length - 1),
                        lastRowLevel = +lastRow.find('[child="1"]').text(),
                        lastModel = this.collection.findWhere({level: lastRowLevel});

                    lastModel.set({
                        level: lastRowLevel + 1,
                        fillRatePercentage: ">" + fillRatePercentage + "%"
//                        incomingAllocPercentage: incomingAllocPercentage + "%",
//                        outgoingAllocPercentage: outgoingAllocPercentage + "%"
                    });
                    this.collection.add({
//                        locationId: this.locationId,
                        level: lastRowLevel,
                        fillRatePercentage: "<" + fillRatePercentage + "%",
                        incomingAllocPercentage: incomingAllocPercentage + "%",
                        outgoingAllocPercentage: outgoingAllocPercentage + "%"
                    },{
                        silent: true
                    });
                    this.$('.fillRateTable').find('input').val("");
                    this.render();
                }
            }
        },

        removeRow: function(){
            var trArr = this.$('tbody tr');
            var lastRow = trArr.eq(trArr.length - 1),
                lastRowLevel = +lastRow.find('[child="1"]').text(),
                lastModel = this.collection.findWhere({level: lastRowLevel}),
                prevModel = this.collection.findWhere({level: lastRowLevel-1}),
                prevPrevModel = this.collection.findWhere({level: lastRowLevel-2});

            if(prevPrevModel == undefined){
                this.collection.reset();
                this.render();
                return;
            }

            lastModel.set({
                level: +lastRowLevel - 1,
                fillRatePercentage: ">" + prevPrevModel.get('fillRatePercentage').replace(/\D+/g,"") + "%"
            });
            this.collection.remove(prevModel, {
                silent: true
            });

            this.render();
        },

        lastRowBlur: function(e){
            var first = $(e.target),
                inputArr = first.closest('tr').find('td[contenteditable="true"]'),
                second = inputArr.not(first),
                firstVal = first.text().replace(/\D+/g,"");
            if(firstVal == ""){first.text("");second.text("");return;}
            if(isNaN(firstVal)||firstVal<0||firstVal>100){
                first.text("");second.text("");
                var message = "Enter correct value from 0 to 100";
                app.vent.trigger('adminError',{type: "showMessage", message: message});
                return;
            }
            var fv = firstVal + "%",
                sv = (100-firstVal) + "%",
                model = this.collection.findWhere({level: this.collection.length}),
                isIncoming = (first.attr('child') == "3");
            model.set({
                incomingAllocPercentage: (isIncoming)? fv : sv,
                outgoingAllocPercentage: (isIncoming)? sv : fv
            });

            first.text(fv);
            second.text(sv);

        }


    });
});