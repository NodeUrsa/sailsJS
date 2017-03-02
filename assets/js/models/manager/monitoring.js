define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({

        urlRoot: "/manager/monitoring",

        dataToRender: function(model){
            var subTypes = ['', 'UPS','Fedex','OnTrac','LoneStar','SpeeDee','BBExpress','MGC','Others'];

            var stage = {
                "1" :"Picking",
                "2" :"Packing",
                "3" :"Wrapping",
                "4" :"Restocking",
                "5" :"Ready",
                "6" : "Posted"
            };

            model.orderDate = moment(model.orderDate).format('MM/DD/YYYY');
            model.releasedDate = moment(model.releasedDate).format('MM/DD/YYYY');

            model.user = (model.user)? model.user.firstName + " " + model.user.lastName : "";

            model.batchStage = stage[model.batchStage];

            model.orderSubType = subTypes[model.orderSubType];

            return model;
        }
    });
});
