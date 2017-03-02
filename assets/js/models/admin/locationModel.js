define(function (require) {

    'use strict';

    // Libraries
    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Marionette          = require('marionette');

    return Backbone.Model.extend({

        defaults: {

        },

        checkAttributes: function(map, context) {

            //shortName
            if(map.shortName == "") {this.showError("'Short Name' field can't be blank");return false;}

            //name
            if(map.name == "") {this.showError("'Location Name' field can't be blank");return false;}

            // branchId
            var branchId = map.branchId;
            if(branchId == "") {this.showError("'ID Number' field can't be blank");return false;}
            if(branchId.length != branchId.replace(/\D+/g,"").length ) {this.showError("'ID Number' field may consist only of numbers");return false;}
            map.branchId = + map.branchId;

            //opsEndHour
            var opsEndHour = map.opsEndHour;
            if(opsEndHour == "") { map.opsEndHour = null}
            else{
                map.opsEndHour = this.timeConvert(opsEndHour, "24");
            }

            //opsStartHour
            var opsStartHour = map.opsStartHour;
            if(opsStartHour == "") { map.opsStartHour = null}
            else{
                map.opsStartHour = this.timeConvert(opsStartHour, "24");
            }

            //packPercentageQueue
            var packPercentageQueue = map.packPercentageQueue;
            if(packPercentageQueue == "") {map.packPercentageQueue = null}
            else{map.packPercentageQueue = packPercentageQueue.replace(/\D+/g,"")}

            //pickPercentageQueue
            var pickPercentageQueue = map.pickPercentageQueue;
            if(pickPercentageQueue == "") {map.pickPercentageQueue = null}
            else{map.pickPercentageQueue = pickPercentageQueue.replace(/\D+/g,"")}

            // docks
            var docks = map.docks;
            if(docks.length != docks.replace(/\D+/g,"").length ) { this.showError("'Number of Docks' field may consist only of numbers");return false;}
            map.docks = docks == "" ? null : +map.docks;

            return map;
        },

        showError: function(message){
            app.vent.trigger('adminError',{type: "showMessage", message: message});
        },

        serializeAttr: function(modelObj){

            //   packPercentageQueue
            var packPer = modelObj.packPercentageQueue;
            if(packPer){modelObj.packPercentageQueue = packPer + "%"}

            //pickPercentageQueue
            var pickPer = modelObj.pickPercentageQueue;
            if(pickPer){modelObj.pickPercentageQueue = pickPer + "%"}

            return modelObj;
        },

        timeConvert:function(time,twelvOrTwen){
            var stSplit = time.split(":");
            var stHour = stSplit[0];
            var stMin = stSplit[1].split(" ")[0];
            var stAmPm = stSplit[1].split(" ")[1];
            var newhr = 0;
            var ampm = '';
            var newtime = '';
            var newmin;
            // alert("hour:"+stHour+"\nmin:"+stMin+"\nampm:"+stAmPm); //see current values
            if (twelvOrTwen == "12") {
                if (stHour == 12){
                    ampm = "am";
                    newhr = 12;
                }
                else if (stHour == "00"){
                    ampm = "pm";
                    newmin = stMin;
                    newhr = 12;
                }
                else if (stHour > 12){
                    newhr = stHour - 12;
                    ampm = "pm";
                }
                else {
                    newhr = stHour;
                    ampm = "am";
                }
                newtime = newhr+":"+stMin+" "+ampm;
            }
            else if (twelvOrTwen == "24"){
                if ((stAmPm == "pm") || (stAmPm == "PM")){
                    if (stHour < 12) {
                        newhr = +stHour + 12; //goes to 13
                    }
                    else { //means is 12:30 PM
                        newhr = "00";
                    }
                }
                else{
                    newhr = stHour;
                }
                newtime = newhr+":"+stMin+":"+"00";
            }
            else {
                alert("No Time To Convert Or Didn't Specify 12 or 24");
            }
            return newtime;
        },

        validation: {
            name: {
                required: true

            },
            shortName: {
                required: true
            },
            branchId: {
                required: true,
                pattern: 'digits'
            },
            address: {

            },
            city: {

            },
            state: {

            },
            zip: {

            },
            opsStartHour: {

            },
            opsEndHour: {

            },
            docks: {
//                pattern: 'digits'
            }
        },

        managerTimeConvert: function(modelObject){
            if(modelObject.opsStartHour){
                modelObject.opsStartHour = this.timeConvert(modelObject.opsStartHour, "12");
            }
            if(modelObject.opsEndHour){
                modelObject.opsEndHour = this.timeConvert(modelObject.opsEndHour, "12");
            }
            return modelObject;
        }

    });

});