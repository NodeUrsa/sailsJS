define(['backbone', 'models/manager/calendarModel'], function (Backbone, calendar) {
    "use strict";
    return Backbone.Collection.extend({
        model: calendar,
        url: "/calendar/workers"
    });
});
