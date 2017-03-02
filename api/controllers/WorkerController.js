/**
 * WorkerController
 *
 * @description :: Server-side logic for managing workers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment'),
    und    = require('underscore');

module.exports = {

    index: function (req, res) {

        res.view('worker/main');

    },

    users: function (req, res) {

        var token  = req.cookies.eq_token;

        async.auto({
            equipment: function (next, data) {
                Equipment.findOne({ token: token }).populate('locationId').exec(next);
            },
            calendar: ['equipment', function (next, data) {
                Calendar.find({
                    locationId: data.equipment.locationId.id,
                    date: moment().format('YYYY-MM-DD')
                }, next);
            }],
            workers: ['equipment', function (next, data) {
                User.find()
                    .populate('workDays')
                    .where({ locationId: data.equipment.locationId.id })
                    .where({ role: [3, 5] })
                    .where({ active: true })
                    .sort('lastName')
                    .exec(next);
            }],
            filteredWorkers: ['workers', 'calendar', function (next, data) {
                next(null, und.first(und.filter(data.workers, function (worker) {
                    var calendarEntry = und.findWhere(data.calendar, { userId: worker.id });
                    if (calendarEntry) {
                        return calendarEntry.onOffFlag;
                    } else {
                        return worker.workDays[moment.localeData().weekdays(moment()).toLowerCase()];
                    }
                }), 30));
            }]
        }, function (err, data) {
            res.json(data.filteredWorkers);
        });

    },

    pick: function (req, res) {

        var itemId   = req.param('id'),
            quantity = req.param('quantity');

        if (!itemId || !quantity) {
            res.send(400);
        } else {
            async.auto({
                user: function (next, data) {
                    User.findOne(req.session.passport.user, next);
                },
                location: ['user', function (next, data) {
                    Location.findOne(data.user.locationId, next);
                }],
                pick: ['location', 'user', function (next, data) {
                    WorkerUtils.pick({
                        item: {
                            id: itemId
                        },
                        location: data.location,
                        user: data.user,
                        quantity: quantity
                    }, next);
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    var item = data.pick.orderListItem;
                    res.json({
                        id: item.id,
                        pn: item.itemNumber,
                        locator: item.locator,
                        stdpk: item.stdpk,
                        orderNumber: item.orderNumber,
                        quantity: {
                            allocated: item.allocatedQuantity,
                            shortage: item.shortageQuantity,
                            picked: item.pickedQuantity,
                            cancelled: item.cancelledQuantity
                        }
                    });
                }
            });
        }

    },

    pack: function (req, res) {

        var itemId   = req.param('id'),
            quantity = req.param('quantity');

        if (!itemId || !quantity) {
            res.send(400);
        } else {
            async.auto({
                user: function (next, data) {
                    User.findOne(req.session.passport.user, next);
                },
                location: ['user', function (next, data) {
                    Location.findOne(data.user.locationId, next);
                }],
                pack: ['location', 'user', function (next, data) {
                    WorkerUtils.pack({
                        item: {
                            id: itemId
                        },
                        location: data.location,
                        user: data.user,
                        quantity: quantity
                    }, next);
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    var item = data.pack.orderListItem;
                    res.json({
                        id: item.id,
                        pn: item.itemNumber,
                        locator: item.locator,
                        stdpk: item.stdpk,
                        orderNumber: item.orderNumber,
                        quantity: {
                            allocated: item.allocatedQuantity,
                            shortage: item.shortageQuantity,
                            picked: item.pickedQuantity,
                            packed: item.packedQuantity,
                            cancelled: item.cancelledQuantity
                        }
                    });
                }
            });
        }

    }

};

module.exports.blueprints = {
    actions: true,
    rest: false,
    shortcuts: false
};