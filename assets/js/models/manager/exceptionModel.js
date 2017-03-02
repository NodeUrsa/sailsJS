define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    return Backbone.Model.extend({
        urlRoot: "/monitoring/exception/orders",

        dataToRender: function(model){
            var types = {
                '1': 'Will Call',
                '2': 'Express',
                '3': 'Truck'
            },
            subTypes = {
                '0': '',
                '1': 'UPS',
                '2': 'Fedex',
                '3': 'OnTrac',
                '4': 'LoneStar',
                '5': 'SpeeDee',
                '6': 'BBExpress',
                '7': 'MGC',
                '8': 'Others'
            };
            model.orderDate = moment(model.orderDate).format('MM/DD/YYYY');
            model.orderType = types[model.orderType];
            model.orderSubType = subTypes[model.orderSubType];

            return model;
        }
    });
});
