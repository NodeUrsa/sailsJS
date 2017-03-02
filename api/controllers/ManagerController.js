/**
 * ManagerController
 *
 * @description :: Server-side logic for managing managers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var und = require('underscore');

module.exports = {

    index: function (req, res) {

        if (!req.isAuthenticated()) res.redirect('/manager/login');

        res.view('manager/main');

    },
    
    login: function (req, res) {

        res.view('manager/login');

    },

    monitoring: function (req, res) {

        var type    = req.param('type'),
            subType = req.param('subtype');

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user).populate('locationId').exec(next);
            },
            headers: ['user', function (next, data) {
                Header
                    .find()
                    .where({
                        orderType   : type,
                        orderSubType: subType,
                        branchId    : data.user.locationId.branchId
                    })
                    .sort('overallRank ASC')
                    .exec(next);
            }],
            batchDetails: ['headers', 'user', function (next, data) {
                var query = BatchDetail.find({ locationId: data.user.locationId.id }, next);//.where({ locationId: data.user.locationId.id });
                // und.each(data.headers, function (header) {
                //     query.where({
                //         docNumber   : header.orderNumber,
                //         deliveryNumb: header.deliveryNum
                //     });
                // });
                // query.exec(next);
            }],
            batchHeaders: ['batchDetails', function (next, data) {
                BatchHeader.find({ masterBatchId: und.union(und.pluck(data.batchDetails, 'masterBatchId')) }, next);
            }],
            workers: ['batchHeaders', function (next, data) {
                User.find({ id: und.union(und.pluck(data.batchHeaders, 'userId')) }, next);
            }]
        }, function (err, data) {
            var orders = [];
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                und.each(data.headers, function (header) {
                    var batchDetail = und.findWhere(data.batchDetails, { docNumber: header.orderNumber, deliveryNumb: header.deliveryNum }),
                        batchHeader = batchDetail ? und.findWhere(data.batchHeaders, { masterBatchId: batchDetail.masterBatchId }) : false,
                        order       = und.extend({}, header);
                    if (batchHeader) {
                        order = und.extend(order, {
                            batchNumber: batchHeader.masterBatchId,
                            batchStage: batchHeader.batchStage,
                            user: und.findWhere(data.workers, { id: +batchHeader.userId })
                        });
                    }
                    orders.push(order);
                });
                res.json(orders);
            }
        });

    }

};

module.exports.blueprints = {
    actions: true,
    rest: false,
    shortcuts: false
};