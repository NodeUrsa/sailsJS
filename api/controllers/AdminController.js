/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var barcode = require('barcode'),
    und     = require('underscore');

module.exports = {

    index: function (req, res) {

        if (!req.isAuthenticated()) res.redirect('/admin/login');

        res.view('admin/main');

    },
    
    login: function (req, res) {

        res.view('admin/login');

    },

    barcode: function (req, res) {

        var masterBatchId = req.param('masterBatchId');

        if (masterBatchId) {
            async.auto({
                batchHeader: function (next, data) {
                    BatchHeader.findOne({
                        masterBatchId: masterBatchId
                    }, next);
                },
                batch: ['batchHeader', function (next, data) {
                    BatchUtils.getBatchByBatchHeaderId(data.batchHeader.id, next);
                }],
                barcodes: ['batch', function (next, data) {
                    async.map(data.batch.orderListItems, function (listItem, next) {
                        console.log('Generate barcode for item #%s', listItem.itemNumber);
                        barcode('code39', {
                            data: listItem.itemNumber,
                            width: 1000,
                            height: 200,
                        }).getBase64(function (err, img) {
                            console.log('Getting base64 for item #%s', listItem.itemNumber);
                            if (err) { return next(err); }
                            next(null, {
                                item: listItem.itemNumber,
                                img: img
                            });
                        });
                    }, next);
                }]
            }, function (err, data) {
                res.view('admin/barcode/list', {
                    barcodes: data.barcodes,
                    layout: 'blank',
                    masterBatchId: masterBatchId
                });
            });
        } else {
            res.view('admin/barcode/list', {
                barcodes: [],
                layout: 'blank',
                masterBatchId: ''
            });
        }

    }

};

module.exports.blueprints = {
    actions: true,
    rest: false,
    shortcuts: false
};