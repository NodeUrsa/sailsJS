/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport'),
    logger   = require('../services/Logger'),
    Agenda   = require('agenda'),
    und      = require('underscore'),
    timer    = require('simple-timer');

module.exports = {
    
    login: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                logger.log('debug', 'login #1', err, user, info);
                logger.log('debug', 'redirect to: ', req.param('ref') + '?error=' + info.message || '');
                res.redirect(req.param('ref') + '?error=' + info.message || '');
                return;
            }
            req.logIn(user, function (err) {
                logger.log('debug', {error: err, user: user});
                if (err) res.send(err);
                if (req.is('json')) {
                    res.send(200);
                } else if (req.param('red')) {
                    if( user.role === 1 || user.role === '1') {
                        res.redirect('admin');
                    } else if ( user.role === 2 || user.role === '2' ) {
                        res.redirect('manager');
                    } else if ( user.role === 5 || user.role === '5' ) {
                        res.redirect('manager');
                    } else if ( user.role === 3 || user.role === 4 || user.role === '3' || user.role === '4' ) {
                        res.redirect((req.param('ref') === undefined ? '/' : req.param('ref')) + '?error=' + 'Access to the requested resource is not allowed from login page.');
                    }
                } else {
                    res.send(200);
                }
            });
        })(req, res);
    },

    me: function (req, res) {
        if (!req.user || !req.user.id) {
            logger.log('debug', 'USER NOT FOUND!');
            res.send(404);
        } else {
            User.findOne(req.user.id, function (err, user) {
                if (!err) {
                    res.json(user);
                } else {
                    res.send(404);
                }
            });
        }
    },

    process: function (req, res) {
        // Procedures
        var getOracleHeaders = require('../../agenda/procedures/getOracleHeaders'),
            saveMySQLHeaders = require('../../agenda/procedures/saveMysqlHeaders'),
            getOracleDetails = require('../../agenda/procedures/getOracleDetails'),
            saveMySQLDetails = require('../../agenda/procedures/saveMysqlDetails');

        var agenda = new Agenda({ db: { address: 'localhost:27017/warehouse-agenda' }});

        agenda.purge(function () {});

        agenda.define('db:migrate:headers', function (job, done) {
            console.log('[ AGENDA ] db:migrate:headers started');
            Location.find({}, function (err, locations) {
                und.each(locations, function (location) {
                    getOracleHeaders.execute(function (err, oracleHeaders) {
                        if (err) { console.log(err); return done(); }
                        saveMySQLHeaders.execute(function () {
                            //done();
                        }, oracleHeaders, Header);
                    }, location.branchId);
                });
                console.log('[ AGENDA ] db:migrate:headers finished');
                done();
            });
        });

        agenda.define('db:migrate:details', function (job, done) {
            console.log('[ AGENDA ] db:migrate:details started');
            Location.find({}, function (err, locations) {
                und.each(locations, function (location) {
                    getOracleDetails.execute(function (err, oracleDetails) {
                        if (err) { console.log(err); return done(); }
                        saveMySQLDetails.execute(function () {
                            //done();
                        }, oracleDetails, Detail);
                    }, location.branchId);
                });
                console.log('[ AGENDA ] db:migrate:details finished');
                done();
            });
        });

        agenda.define('db:sync:shipConfirm', function (job, done) {
            console.log('[ AGENDA ] db:sync:shipConfirm started');
            async.auto({
                shipConfirmOrders: function (next, data) {
                    ShippingConfirm.find({}, next);
                },
                existingBatches: function (next, data) {
                    BatchDetail.find({}, next);
                },
                locations: function (next, data) {
                    Location.find({}, next);
                },
                filteredShipConfirmOrders: ['shipConfirmOrders', 'existingBatches', 'locations', function (next, data) {
                    next(null, und.filter(data.shipConfirmOrders, function (order) {
                        var location = und.findWhere(data.locations, { branchId: order.branchId });
                        return !und.findWhere(data.existingBatches, {
                            locationId: location.id,
                            docNumber: order.orderNumber,
                            deliveryNumb: order.deliveryNumber
                        });
                    }));
                }],
                removeConfirmedOrders: ['filteredShipConfirmOrders', function (next, data) {
                    async.map(data.filteredShipConfirmOrders, function (order, next) {
                        Header.destroy({
                            branchId: order.branchId,
                            orderNumber: order.orderNumber,
                            deliveryNum: order.deliveryNumber
                        }, next);
                    }, next);
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                }
                done();
            });
        });

        // agenda.every('1 hour', 'db:migrate:headers');
        // agenda.every('1 hour', 'db:migrate:details');
        agenda.every('5 minute', 'db:sync:shipConfirm');

        agenda.start();

        res.send(200);
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    }

};

