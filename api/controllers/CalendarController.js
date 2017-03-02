/**
 * CalendarController
 *
 * @description :: Server-side logic for managing calendars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var und    = require('underscore'),
    moment = require('moment');

module.exports = {

    getWorkersByDay: function (req, res) {

        var day = req.param('day');

        if (!day) {
            return res.send(400, { error: 'Day is required parameter' });
        }

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user, next);
            },
            calendarItems: ['user', function (next, data) {
                Calendar.find({
                    locationId: data.user.locationId,
                    date: day
                }, next);
            }],
            workers: ['user', function (next, data) {
                User.find({
                    locationId: data.user.locationId,
                    role: [3, 5],
                    active: true
                }).sort('lastName').populate('workDays').exec(next);
            }],
            filteredWorkers: ['calendarItems', 'workers', function (next, data) {
                var workers = [];
                und.each(data.workers, function (worker) {
                    var calendarItem  = und.findWhere(data.calendarItems, { userId: worker.id }),
                        currentWorker = und.extend({}, und.pick(worker, 'id', 'firstName', 'lastName'));
                    if (calendarItem) {
                        currentWorker.onOffFlag  = calendarItem.onOffFlag;
                        currentWorker.assignment = calendarItem.assignment;
                    } else {
                        currentWorker.onOffFlag  = worker.workDays[moment.localeData().weekdays(moment()).toLowerCase()];
                        currentWorker.assignment = 1;
                    }
                    workers.push(currentWorker);
                });
                next(null, workers);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json(data.filteredWorkers);
            }
        });

    },

    setWorkersByDay: function (req, res) {
        var workers = req.param('workers'),
            day     = req.param('day');

        if (!workers || !workers.length) {
            return res.send(400, { error: 'Workers array is required' });
        } else if (!day) {
            return res.send(400, { error: 'Day is required' });
        }

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user, next);
            },
            updateCalendar: ['user', function (next, data) {
                async.map(workers, function (entry, next) {
                    Calendar.findOrCreate({
                        locationId: data.user.locationId,
                        userId: entry.id,
                        date: day
                    }, {
                        locationId: data.user.locationId,
                        date: day,
                        userId: entry.id,
                        onOffFlag: entry.onOffFlag,
                        assignment: entry.assignment
                    }, next);
                }, next);
            }],
            postUpdateCalendar: ['updateCalendar', 'user', function (next, data) {
                // var filteredWorkers = und.filter(workers, function (entry) {
                //     return !und.findWhere(data.updateCalendar, { userId: entry.id });
                // });
                async.map(workers, function (entry, next) {
                    Calendar.update({
                        locationId: data.user.locationId,
                        date: day,
                        userId: entry.id
                    }, {
                        onOffFlag: entry.onOffFlag,
                        assignment: entry.assignment
                    }, next);
                }, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.ok();
            }
        });

    }
	
};