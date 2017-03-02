var moment = require('moment'),
    und    = require('underscore');

module.exports = {

    normalizeOrderItem: function (item, ext) {
        ext = ext || {};
        return und.extend({
            id: item.id,
            pn: item.itemNumber,
            line: item.lineNumber,
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
        }, ext);
    },

    ormCallback: function (req, res, cb) {
        return function (err, item) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                cb(item);
            }
        };
    },

    getBatchByBatchHeaderId: function (id, cb) {
        var self = this;
        async.auto({
            batchHeader: function (next, data) {
                BatchHeader.findOne(id).populate('locationId').populate('orderType').exec(next);
            },
            batchDetails: ['batchHeader', function (next, data) {
                BatchDetail.find({ masterBatchId: data.batchHeader.masterBatchId }, next);
            }],
            headers: ['batchHeader', 'batchDetails', function (next, data) {
                async.map(data.batchDetails, function (batchDetail, next) {
                    Header.findOne({
                        branchId   : data.batchHeader.locationId.branchId,
                        deliveryNum: batchDetail.deliveryNumb,
                        orderNumber: batchDetail.docNumber
                    }, next);
                }, next);
            }],
            orderListItems: ['batchHeader', 'batchDetails', function (next, data) {
                async.map(data.batchDetails, function (batchDetail, next) {
                    OrderList.find({
                        locationId : data.batchHeader.locationId.id,
                        deliveryNum: batchDetail.deliveryNumb,
                        orderNumber: batchDetail.docNumber
                    }, next);
                }, function (err, orderListItems) {
                    if (err) {
                        next(err);
                    } else {
                        next(null, und.flatten(orderListItems, true));
                    }
                });
            }],
            preview: ['batchHeader', 'batchDetails', 'headers', 'orderListItems', function (next, data) {
                self.generateBatchPreview({
                    location : data.batchHeader.locationId,
                    orderType: data.batchHeader.orderType,
                    headers  : data.headers,
                    orderList: data.orderListItems,
                    batch: {
                        header : data.batchHeader,
                        details: data.batchDetails
                    }
                }, next);
            }]
        }, cb);
    },

    /**
     * @param {object} data
     * 
     * @param {Location}  data.location         - current location
     * @param {OrderType} data.orderType        - ordertype of the batch
     * @param {User}      data.user             - user which will be asigned to the batch
     * @param {array}     data.headers          - collection of orders to be included to batch
     * @param {number}    data.batchProcessType - BatchHeader.batchProcessType
     * @param {function}  cb                    - callback
     *
     */
    createBatch: function (data, cb) {
        var self = this;
        async.auto({
            existingBatchDetails: function (next, asyncData) {
                async.map(data.headers, function (header, next) {
                    BatchDetail.findOne({
                        locationId  : data.location.id,
                        deliveryNumb: header.deliveryNum,
                        docNumber   : header.orderNumber
                    }, next);
                }, next);
            },
            validateBatch: ['existingBatchDetails', function (next, asyncData) {
                if (und.compact(asyncData.existingBatchDetails).length) {
                    next('There are some orders already included to existing batches');
                } else {
                    next();
                }
            }],
            batchHeader: ['validateBatch', function (next, asyncData) {
                BatchHeader.create({
                    locationId:       data.location !== undefined ? data.location.id : null,
                    userId:           data.user !== undefined ? data.user.id : null,
                    masterBatchId:    generateMasterBatchID(data.location),
                    orderType:        data.orderType.id,
                    batchStatus:      1,
                    // TODO: set batchType 2 for incoming orders
                    batchType:        1,
                    batchStage:       1,
                    batchProcessType: data.batchProcessType !== undefined ? data.batchProcessType : 3
                }).exec(next);
            }],
            batchDetails: ['validateBatch', 'batchHeader', function (next, asyncData) {
                async.map(data.headers, function (header, mapNext) {
                    BatchDetail.create({
                        locationId:     data.location.id,
                        batchId:        asyncData.batchHeader.id,
                        masterBatchId:  asyncData.batchHeader.masterBatchId,
                        batchOrderRank: 0,
                        docNumber:      header.orderNumber,
                        deliveryNumb:   header.deliveryNum,
                        orderType:      data.orderType.id,
                        orderSubType:   header.orderSubType,
                        orderStage:     1
                    }).exec(mapNext);   
                }, next);
            }],
            details: ['validateBatch', 'batchDetails', function (next, asyncData) {
                async.map(data.headers, function (header, mapNext) {
                    Detail.find({
                        branchId:    data.location.branchId,
                        deliveryNum: header.deliveryNum,
                        orderNumber: header.orderNumber
                    }, mapNext);
                }, next);
            }],
            info: ['validateBatch', 'batchHeader', function (next, asyncData) {
                QueueBalance.create({
                    batchId: asyncData.batchHeader.id,
                    locationId: data.location.id,
                    rankIn: 0,
                    rankOut: 0,
                    // TODO: set batchType 2 for incoming orders
                    batchType: 1,
                    workerActive: true
                }, next);
            }],
            orderList: ['validateBatch', 'batchDetails', 'details', function (next, asyncData) {
                async.map(und.flatten(asyncData.details, true), function (detail, mapNext) {
                    OrderList.create({
                        locationId        : data.location.id,
                        orderNumber       : detail.orderNumber,
                        deliveryNum       : detail.deliveryNum,
                        lineNumber        : detail.lineNumber,
                        itemNumber        : detail.itemNumber,
                        locator           : detail.locator,
                        stdpk             : detail.stdpk,
                        allocatedQuantity : parseInt(detail.allocatedQuantity, 10) || 0,
                        cancelledQuantity : parseInt(detail.cancelledQuantity, 10) || 0,
                        shortageQuantity  : parseInt(detail.allocatedQuantity, 10) || 0,
                        pickedQuantity    : 0,
                        quadrant          : '',
                        boxNumber         : '',
                        palletNumber      : 1
                    }, mapNext);
                }, next);
            }],
            updateBatchNumber: ['validateBatch', 'batchHeader', function (next, asyncData) {
                Location.update(data.location.id, { nextBatchNumber: ++data.location.nextBatchNumber }, next);
            }],
            preview: ['validateBatch', 'batchHeader', 'batchDetails', 'details', 'info', 'orderList', 'updateBatchNumber', function (next, asyncData) {
                self.generateBatchPreview({
                    location : data.location,
                    orderType: data.orderType,
                    batch: {
                        header : asyncData.batchHeader,
                        details: asyncData.batchDetails
                    }
                }, next);
            }],
            destroyByTimer: ['validateBatch', 'batchHeader', function (next, asyncData) {
                if (asyncData.batchHeader.batchProcessType == 3) {
                    setTimeout(function () {
                        self.removeBatch(asyncData.batchHeader.id, true);
                    }, 900000);
                }
                next();
            }]
        }, cb);
    },

    removeBatch: function (id, waitingStatusOnly, cb) {
        console.log('Starting batch removement process...');
        async.auto({
            batchHeader: function (next, data) {
                BatchHeader.findOne(id, next);
            },
            valid: ['batchHeader', function (next, data) {
                console.log('Verifying ability to remove batch #%s...', data.batchHeader.id);
                if ((waitingStatusOnly && data.batchHeader.batchStatus == 1) || !waitingStatusOnly) {
                    console.log('Batch #%s (batchStatus %s) can be romoved', data.batchHeader.id, data.batchHeader.batchStatus);
                    next();
                } else {
                    console.log('Batch #%s (batchStatus %s) can not be romoved', data.batchHeader.id, data.batchHeader.batchStatus);
                    next('This batch is not on Waiting status');
                }
            }],
            removeBatchHeader: ['batchHeader', 'valid', function (next, data) {
                BatchHeader.destroy(data.batchHeader.id, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Batch #%s successfuly removed', data.batchHeader.id);
            }
            if (typeof cb === 'function') {
                cb(err, data);
            }
        });
    },

    /**
     * @param {object}        data
     * 
     * @param {Location}      data.location  - current location
     * @param {OrderType}     data.orderType - ordertype of the batch
     * @param {User}          data.user      - user which will be asigned to the batch
     * @param {array}         data.headers   - collection of orders to be included to batch
     *
     * @param {object}        data.batch
     * 
     * @param {BatchHeader}   data.batch.header
     * @param {BatchDetail[]} data.batch.details
     *
     * @param {function}      cb             - callback
     *
     */
    generateBatchPreview: function (data, cb) {
        var self = this,
            preview = {
            masterBatchId: data.batch.header.masterBatchId,
            orderType    : data.orderType,
            ordersCount  : data.batch.details.length,
            currentOrder : 1,
            batchStage   : data.batch.header.batchStage
        };
        if (data.batch.header.transferLocation) {
            preview.transfer = {
                location: data.batch.header.transferLocation,
                show: !data.batch.header.transferNoticed
            };
        }
        if (data.batch.header.batchStage == 2) {
            var currentOrder   = 0,
                foundOrderFlag = false;
            und.each(data.headers, function (header, index) {
                //debugger;
                header.items = header.items || [];
                und.each(und.where(data.orderList, { orderNumber: header.orderNumber }), function (item) {
                    header.items.push(self.normalizeOrderItem(item));
                    if (item.packedQuantity != (item.allocatedQuantity - item.cancelledQuantity) && !foundOrderFlag) {
                        foundOrderFlag = true;
                        currentOrder = index + 1;
                    }
                });
            });
            if (!foundOrderFlag) {
                currentOrder = data.headers.length;
            }
            preview.currentOrder = currentOrder;
        }
        cb(null, preview);
    },

    /**
     * @param {object}        data
     * 
     * @param {Location}      data.location  - current location
     *
     * @param {function}      cb             - callback
     *
     */
    recalculateBalanceQueue: function (data, cb) {
        async.auto({
            packBatches: function (next, asyncData) {
                BatchHeader.find({
                    locationId: data.location.id,
                    batchStage: 2
                }).sort('batchProcessType ASC').populate('orderType').exec(next);
            },
            orderMatrix: function (next, asyncData) {
                OrderMatrix.find({
                    locationId: data.location.id
                }).sort('ranking ASC').exec(next);
            },
            queueBalanceItems: ['packBatches', function (next, asyncData) {
                QueueBalance.find({
                    batchId: und.pluck(asyncData.packBatches, 'id'),
                    workerActive: false
                }).exec(next);
            }],
            sort: ['packBatches', 'queueBalanceItems', 'orderMatrix', function (next, asyncData) {
                var batches = {
                    exception  : [],
                    transfer   : [],
                    orderMatrix: [],
                    unsorted   : [],
                    sorted     : []
                };

                batches.unsorted    = und.filter(asyncData.packBatches, function (batch) { return !!und.findWhere(asyncData.queueBalanceItems, { batchId: batch.id }); });
                batches.exception   = und.where(batches.unsorted, { batchProcessType: 1 });
                batches.transfer    = und.where(batches.unsorted, { batchProcessType: 2 });
                batches.unsorted    = und.where(batches.unsorted, { batchProcessType: 3 });

                if (batches.unsorted.length) {
                    und.each(asyncData.orderMatrix, function (rule) {
                        batches.orderMatrix.push(und.filter(batches.unsorted, function (b) {
                            return b.orderType.orderType == rule.orderType && b.orderType.orderSubType == rule.orderSubType;
                        }));
                    });
                }

                batches.orderMatrix = und.flatten(batches.orderMatrix, true);
                batches.sorted      = batches.exception.concat(batches.transfer).concat(batches.transfer).concat(batches.orderMatrix);

                next(null, batches.sorted);
            }],
            updateBalanceQueue: ['sort', function (next, asyncData) {
                und.each(asyncData.sort, function (batch, index) {
                    batch.rankOut = index + 1;
                });
                async.each(asyncData.sort, function (batch, next) {
                    QueueBalance.update({
                        batchId: batch.id
                    }, {
                        rankOut: batch.rankOut
                    }, next);
                }, next);
            }]
        }, function (err, asyncData) {
            if (err) {
                console.log(err);
                cb(err);
            } else {
                cb(null);
            }
        });
    },

    /**
     * @param {object}        data
     * 
     * @param {OrderType}     data.orderType - ordertype of the batch
     * @param {array}         data.headers   - collection of orders to be included to batch
     *
     * @param {function}      cb             - callback
     *
     */
    willCallGroup: function (data, cb) {

        var source  = data.headers.slice(0),
            headers = data.headers.slice(0),
            results = [],
            index   = 0;

        iterate();

        function iterate () {
            console.log('iterate...');
            var counter = { combineByItems: 0, combineByOrders: 0, combineByCbf: 0 },
                ordersToBeRemoved = [];
            for (var i = 0; i < headers.length; i++) {
                console.log('counter:', JSON.stringify(counter));
                if (i !== 0 &&
                   (data.orderType.combineByItems  && ((counter.combineByItems  + headers[i].pieces) > data.orderType.combineByItemsNumber) ||
                    data.orderType.combineByOrders && ((counter.combineByOrders + 1) > data.orderType.combineByOrdersNumber) ||
                    data.orderType.combineByCbf    && ((counter.combineByCbf    + parseFloat(headers[i].cbf)) > data.orderType.combineByCbfNumber))) {
                    // skipping
                    console.log('skipping order #%s (items: %s, cbf: %s)', headers[i].orderNumber, headers[i].pieces, headers[i].cbf);
                } else {
                    console.log('adding order #%s (items: %s, cbf: %s)', headers[i].orderNumber, headers[i].pieces, headers[i].cbf);
                    counter.combineByItems += headers[i].pieces;
                    counter.combineByOrders++;
                    counter.combineByCbf += parseFloat(headers[i].cbf);
                    results[index] = results[index] || [];
                    results[index].push(headers[i]);
                    //results[index].push(headers.splice(i, i + 1));
                    ordersToBeRemoved.push(i);
                    if (data.orderType.combineByItems  && counter.combineByItems  == data.orderType.combineByItemsNumber ||
                        data.orderType.combineByOrders && counter.combineByOrders == data.orderType.combineByOrdersNumber ||
                        data.orderType.combineByCbf    && counter.combineByCbf    == data.orderType.combineByCbfNumber) {
                        break;
                    }
                }
            }
            und.each(ordersToBeRemoved, function (i, cnt) {
                headers.splice(i - cnt, i - cnt + 1);
            });
            if (headers.length) {
                console.log('Batch #%s complete, starting processing of batch #%s', index, index + 1);
                index++;
                iterate();
            } else {
                console.log('Batch #%s complete, there are no more orders in the list', index);
                cb(null, results);
            }
        }

    }

};

function addZeros (num, len) {
    var zerosNeeded = len - String(num).length,
        zeros       = '';

    und(zerosNeeded).times(function () {
        zeros += '0';
    });

    return zeros + num;
}

function generateMasterBatchID (location) {
    var date       = moment(),
        year       = date.format('YY'),
        month      = date.format('MM'),
        day        = date.format('DD'),
        template   = 'XXYYMMDD001',
        batchId    = '';

    batchId = template
                .replace('YY', year)
                .replace('XX', addZeros(location.branchId, 2))
                .replace('MM', month)
                .replace('DD', day)
                .replace('001', addZeros(location.nextBatchNumber, 3));

    return batchId;
}