/**
 * BatchController
 *
 * @description :: Server-side logic for managing batches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment'),
    und    = require('underscore');

module.exports = {

    index: function (req, res) {

        var batchId = req.param('id');

        if (!batchId) {
            res.send(400);
        } else {
            BatchHeader
                .findOne({
                    userId: req.session.passport.user,
                    masterBatchId: batchId
                })
                .exec(function (err, batch) {
                    if (err) {
                        console.log(err);
                        res.send(500, { error: err });
                    } else if (!batch) {
                        res.send(404);
                    } else {
                        res.json({});
                    }
                });
        }

    },
	
    items: function (req, res) {

        async.auto({
            existingBatch: function (next) {
                BatchHeader
                    .findOne()
                    .populate('orderType')
                    .where({
                        userId: req.session.passport.user,
                        batchStage: [1,2]
                    }).exec(next);
            },
            existingBatchDetail: ['existingBatch', function (next, data) {
                if (!data.existingBatch) {
                    next('There is no batch.');
                } else {
                    BatchDetail.find({ masterBatchId: data.existingBatch.masterBatchId }, next);
                }
            }],
            updateStatus: ['existingBatchDetail', function (next, data) {
                if (data.existingBatch.batchStage == 1) {
                    BatchHeader.update(data.existingBatch.id, {
                        batchStatus: 2
                    }, next);
                } else {
                    next();
                }
            }],
            existingBatchItems: ['existingBatchDetail', function (next, data) {
                OrderList.find({ deliveryNum: und.pluck(data.existingBatchDetail, 'deliveryNumb') }).sort('locator ASC').exec(next);
            }],
            existingHeaders: ['existingBatchDetail', function (next, data) {
                Header.find({ deliveryNum: und.pluck(data.existingBatchDetail, 'deliveryNumb') }, next);
            }]
        }, function (err, data) {
            var batch = {
                items: [],
                orders: data.existingHeaders
            };
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else if (data.existingBatch) {
                var counter = 1;
                und.extend(batch, {
                    masterBatchId: data.existingBatch.masterBatchId,
                    orderType    : data.existingBatch.orderType,
                    ordersCount  : data.existingBatchDetail.length,
                    batchStage   : data.existingBatch.batchStage
                });
                und.each(data.existingBatchItems, function (item) {
                    batch.items.push(BatchUtils.normalizeOrderItem(item, { line: counter }));
                    counter++;
                });
                res.json(batch);
            } else {
                res.send(404);
            }
        });

    },

    order: function (req, res) {

        var orderNumber = req.param('id');

        if (!orderNumber) {
            res.send(400);
        } else {
            async.auto({
                existingBatch: function (next) {
                    BatchHeader
                        .findOne()
                        .populate('orderType')
                        .where({
                            userId: req.session.passport.user,
                            batchStage: [1,2]
                        }).exec(next);
                },
                existingBatchDetail: ['existingBatch', function (next, data) {
                    if (!data.existingBatch) {
                        next('There is no batch.');
                    } else {
                        BatchDetail.find({ masterBatchId: data.existingBatch.masterBatchId }, next);
                    }
                }],
                existingBatchItems: ['existingBatchDetail', function (next, data) {
                    OrderList.find({ deliveryNum: und.pluck(data.existingBatchDetail, 'deliveryNumb') }).sort('locator ASC').exec(next);
                }],
                existingHeaders: ['existingBatchDetail', function (next, data) {
                    Header.find({ deliveryNum: und.pluck(data.existingBatchDetail, 'deliveryNumb') }, next);
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else if (!data.existingHeaders[orderNumber - 1]) {
                    res.send(400, { error: 'Wrong order number' });
                } else if (data.existingBatch) {
                    var order   = data.existingHeaders[orderNumber - 1],
                        counter = 1;
                    und.extend(order, {
                        items: []
                    });
                    und.each(und.where(data.existingBatchItems, { orderNumber: order.orderNumber }), function (item) {
                        order.items.push(BatchUtils.normalizeOrderItem(item, { line: counter }));
                        counter++;
                    });
                    res.json(order);
                } else {
                    res.send(404);
                }
            });
        }

    },

    preview: function (req, res) {

        BatchHeader
            .findOne({
                userId: req.session.passport.user,
                batchStage: [1,2]
            })
            .populate('orderType')
            .exec(function (err, existingBatch) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else if (existingBatch) {
                    BatchUtils.getBatchByBatchHeaderId(existingBatch.id, function (err, batch) {
                        res.json(batch.preview);
                    }); 
                } else {
                    async.auto({
                        user: function (next) {
                            User.findOne(req.session.passport.user, next);
                        },
                        recalculateBalanceQueue: ['location', function (next, data) {
                            BatchUtils.recalculateBalanceQueue({
                                location: data.location
                            }, next);
                        }],
                        location: ['user', function (next, data) {
                            if (und.some(und.pick(data.user, 'willcallPick', 'willcallPack'/*, 'expressPick', 'expressPack', 'truckPick', 'truckPack'*/))) {
                                Location.findOne(data.user.locationId, next);
                            } else {
                                next('There are no activities enabled for this user.');
                            }
                        }],
                        orderType: ['location', function (next, data) {
                            OrderType.findOne({ orderType: 1, locationId: data.location.id }, next);
                        }],
                        batchDetails: function (next, data) {
                            BatchDetail.find().exec(next);
                        },
                        headers: ['location', 'orderType', 'batchDetails', function (next, data) {
                            var query = {
                                branchId: data.location.branchId,
                                orderType: data.orderType.orderType
                                //cancelStatus: false
                            };
                            if (und.pluck(data.batchDetails, 'deliveryNumb').length) {
                                query.deliveryNum = {
                                    '!': und.pluck(data.batchDetails, 'deliveryNumb')
                                };
                            }
                            Header
                                .find()
                                .where(query)
                                .sort('overallRank ASC')
                                .exec(next);
                        }],
                        pickBatches: ['orderType', 'headers', function (next, data) {
                            BatchUtils.willCallGroup({
                                orderType: data.orderType,
                                headers: data.headers
                            }, next);
                        }],
                        packBatches: ['location', 'recalculateBalanceQueue', function (next, data) {
                            QueueBalance.find({
                                locationId: data.location.id,
                                workerActive: false
                            }).sort('rankOut ASC').populate('batchId').exec(function (err, bqItems) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null, und.where(und.pluck(bqItems, 'batchId'), { batchStage: 2 }));
                                }
                            });
                        }],
                        balanceQueue: ['pickBatches', 'packBatches', 'location', 'user', function (next, data) {
                            var pickBatches         = data.pickBatches ? data.pickBatches.length : 0,
                                packBatches         = data.packBatches.length,
                                pickBatchPercentage = (pickBatches / (pickBatches + packBatches)) * 100;
                            console.log('pickBatches: %s', pickBatches);
                            console.log('packBatches: %s', packBatches);
                            console.log('pickBatchPercentage: %s%', pickBatchPercentage);
                            console.log('pickPercentageQueue: ', data.location.pickPercentageQueue);
                            console.log('Condition: ', pickBatchPercentage >= data.location.pickPercentageQueue);
                            if (!pickBatches && !packBatches) {
                                next('There are no orders to process');
                            } else if (data.user.willcallPick && pickBatches && pickBatchPercentage >= data.location.pickPercentageQueue) {
                                console.log('---> pick');
                                next(null, 'pick');
                            } else if (data.user.willcallPack && packBatches) {
                                console.log('---> pack');
                                next(null, 'pack');
                            } else {
                                next('There are no orders to process');
                            }
                        }],
                        batch: ['balanceQueue', 'location', 'orderType', 'user', 'pickBatches', 'packBatches', function (next, data) {
                            switch (data.balanceQueue) {
                                case 'pick':
                                    BatchUtils.createBatch({
                                        location  : data.location,
                                        orderType : data.orderType,
                                        user      : data.user,
                                        headers   : data.pickBatches[0]
                                    }, next);
                                    break;
                                case 'pack':
                                    BatchUtils.getBatchByBatchHeaderId(data.packBatches[0].id, function (err, batch) {
                                        if (err) {
                                            return next(err);
                                        }
                                        async.auto({
                                            updateBQ: function (next, asyncData) {
                                                QueueBalance.update({
                                                    batchId: batch.batchHeader.id
                                                }, {
                                                    workerActive: true
                                                }, next);
                                            },
                                            updateBH: function (next, asyncData) {
                                                BatchHeader.update(batch.batchHeader.id, {
                                                    userId: data.user.id
                                                }, next);
                                            }
                                        }, function (err, asyncData) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                next(null, batch);
                                            }
                                        });
                                    });
                                    break;
                                default:
                                    next('Unknown error');
                            }
                        }]
                    }, function (err, data) {
                        if (err) {
                            console.log(err);
                            res.send(500, { error: err });
                        } else {
                            res.json(data.batch.preview);
                        }
                    });
                }
            });

    },

    completeOrder: function (req, res) {

        var orderNumber   = req.param('id'),
            masterBatchId = req.param('masterBatchId'),
            deliveryNum   = req.param('deliveryNum');

        if (!orderNumber || !masterBatchId) {
            res.send(400);
        } else {
            BatchDetail.update({
                masterBatchId: masterBatchId,
                docNumber    : orderNumber,
                deliveryNumb : deliveryNum
            }, { orderStage: 4 }, function (err, updated) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    res.json({
                        status: 'ok'
                    });
                }
            });
        }

    },

    finish: function (req, res) {

        var batchId = req.param('id');

        if (!batchId) {
            res.send(400);
        } else {
            async.auto({
                user: function (next) {
                    User.findOne(req.session.passport.user, next);
                },
                location: ['user', function (next, data) {
                    Location.findOne(data.user.locationId, next);
                }],
                batch: function (next, data) {
                    BatchHeader
                        .findOne({
                            userId: req.session.passport.user,
                            masterBatchId: batchId
                        })
                        .populate('orderType')
                        .exec(next);
                },
                batchStage: ['batch', function (next, data) {
                    var nextStage;
                    switch (data.batch.orderType.orderType) {
                        // Will Call
                        case 1:
                            if (data.batch.batchStage == 2) {
                                nextStage = 5;
                            } else {
                                nextStage = data.batch.batchStage + 1;
                            }
                            break;
                    }
                    next(null, nextStage);
                }],
                updateBatch: ['batch', 'user', 'updateOrderStage', 'batchStage', function (next, data) {
                    if (!data.batch) {
                        next('Batch not found');
                    } else if (data.batch.orderType.pickPackFlag && data.user.willcallPack) {
                        BatchHeader.update(data.batch.id, {
                            batchStage: data.batchStage
                        }, next);
                    } else {
                        BatchHeader.update(data.batch.id, {
                            batchStage: data.batchStage,
                            userId: null
                        }, next);
                    }
                }],
                updateOrderStage: ['batch', function (next, data) {
                    var orderStage;
                    switch (data.batch.batchStage) {
                        case 1:
                            orderStage = 2;
                            break;
                        case 2:
                            orderStage = 4;
                            break;
                        case 5:
                            orderStage = 4;
                            break;
                    }
                    BatchDetail.update({ masterBatchId: data.batch.masterBatchId }, { orderStage: orderStage }, next);
                }],
                updateInfo: ['updateBatch', 'batch', function (next, data) {
                    if (und.isNull(data.updateBatch[0].userId)) {
                        QueueBalance.update({ batchId: data.batch.id }, { workerActive: false }, next);
                    } else {
                        next(null, true);
                    }
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    res.json({
                        status: 'ok'
                    });
                }
            });
        }

    },

    transfer: function (req, res) {

        var userId          = req.param('userId'),
            masterBatchId   = req.param('masterBatchId'),
            location        = req.param('location'),
            logOff          = req.param('logOff');

        // TODO: log user off in case of logOff flag

        if (!masterBatchId) {
            res.send(400);
        } else {
            BatchHeader.update({
                masterBatchId: masterBatchId
            }, {
                userId: userId || null,
                transferLocation: location,
                transferNoticed: false,
                batchProcessType: 2
            }, function (err, batch) {
                if (!err) {
                    if (!!batch.length) {
                        res.json(batch[0]);
                    } else {
                        res.send('No record found with the specified `masterBatchId`.');
                    }
                } else {
                    res.send(err, { error: err });
                }
            });
        }

    },

    transferAccept: function (req, res) {

        var masterBatchId = req.param('masterBatchId');

        BatchHeader.update({ masterBatchId: masterBatchId }, { transferNoticed: true }, function (err, updated) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json({
                    status: 'ok'
                });
            }
        });

    },

    bin: function (req, res) {

        var masterBatchId  = req.param('masterBatchId'),
            binLocation    = req.param('binLocation') ? req.param('binLocation').split('-') : false,
            deliveryNum    = req.param('deliveryNum'),
            customerNumber = req.param('customerNumber'),
            force          = req.param('force');

        if (masterBatchId && binLocation && deliveryNum && customerNumber) {
            async.auto({
                batchDetails: function (next, data) {
                    BatchDetail.find().exec(next);
                },
                headers: ['batchDetails', function (next, data) {
                    Header.find({
                        customerNumber: {
                            '!': customerNumber
                        },
                        deliveryNum: und.pluck(data.batchDetails, 'deliveryNumb')
                    }, next);
                }],
                sameBins: ['headers', function (next, data) {
                    BatchDetail.find({
                        binLocation: binLocation[0],
                        deliveryNumb: und.pluck(data.headers, 'deliveryNum')
                    }, next);
                }],
                validateBinLocation: ['sameBins', function (next, data) {
                    if (force || !data.sameBins.length) {
                        next();
                    } else {
                        next('Another customer already has an order on that pallet.');
                    }
                }],
                update: ['validateBinLocation', function (next, data) {
                    BatchDetail.update({
                        masterBatchId: masterBatchId,
                        deliveryNumb: deliveryNum
                    }, {
                        binLocation: binLocation[0],
                        quadrant: binLocation[1]
                    }, next);
                }]
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    res.json({
                        status: 'ok'
                    });
                }
            });
        } else if (customerNumber) {
            Header
                .find()
                .where({ customerNumber: customerNumber })
                .exec(function (err, headers) {
                    if (err) {
                        console.log(err);
                        res.send(500, { error: err });
                    } else if (!headers || !headers.length) {
                        res.send(404);
                    } else {
                        BatchDetail
                            .find()
                            .where({
                                deliveryNumb: und.pluck(headers, 'deliveryNum'),
                                orderStage: 4
                            })
                            .exec(function (err, batchDetails) {
                                if (err) {
                                    console.log(err);
                                    res.send(500, { error: err });
                                } else if (!batchDetails || !batchDetails.length) {
                                    res.json([]);
                                } else {
                                    var data = [];
                                    und.each(batchDetails, function (detail) {
                                        if (detail.binLocation) {
                                            data.push({
                                                binLocation: detail.binLocation + '-' + detail.quadrant,
                                                orderNumber: detail.docNumber
                                            });
                                        }
                                    });
                                    res.json(data);
                                }
                            });
                    }
                });
        } else {
            res.send(400);
        }

    },

    box: function (req, res) {

        var boxLabel = req.param('label');

        if (!boxLabel) {
            res.send(400, { error: { text: 'Box label is required.' } });
            return;
        }

        async.auto({
            orderBox: function (next, data) {
                OrderBoxDimension.findOrCreate({ masterBox: boxLabel }, { masterBox: boxLabel }, next);
            },
            processingItems: ['orderBox', function (next, data) {
                OrderProcessing.find({ boxNumber: data.orderBox.id }, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                data.orderBox.items = [];
                und.each(data.processingItems, function (item) {
                    if (!und.where(data.orderBox.items, { itemNumber: item.itemNumber }).length) {
                        data.orderBox.items.push({
                            orderNumber: item.orderNumber,
                            itemNumber: item.itemNumber,
                            quantity: und.where(data.processingItems, { itemNumber: item.itemNumber }).length
                        });
                    }
                });
                res.json(data.orderBox);
            }
        });

    },

    assignToBox: function (req, res) {

        var boxLabel    = req.param('boxLabel'),
            itemNumber  = req.param('itemNumber'),
            quantity    = req.param('quantity'),
            type        = req.param('type'),
            orderNumber = req.param('orderNumber'),
            deliveryNum = req.param('deliveryNum');

        async.auto({
            user: function (next, data) {
                User.findOne(req.session.passport.user, next);
            },
            location: ['user', function (next, data) {
                Location.findOne(data.user.locationId, next);
            }],
            processType: ['user', 'location', function (next, data) {
                switch (type) {
                    // Items to be picked
                    case '1':
                        WorkerUtils.pick({
                            item: {
                                pn: itemNumber,
                                orderNumber: orderNumber,
                                deliveryNum: deliveryNum
                            },
                            location: data.location,
                            user: data.user,
                            quantity: quantity
                        }, next);
                        break;
                    // Items to be packed
                    case '2':
                        WorkerUtils.pack({
                            item: {
                                pn: itemNumber,
                                orderNumber: orderNumber,
                                deliveryNum: deliveryNum
                            },
                            location: data.location,
                            user: data.user,
                            quantity: quantity
                        }, next);
                        break;
                    // Picked
                    case '3':
                    // Packed
                    case '4':
                        next(null);
                        break;
                    default:
                        next('Type is not specified');
                }
            }],
            processingItems: ['processType', 'location', function (next, data) {
                OrderProcessing
                    .find()
                    .where({
                        locationId : data.location.id,
                        orderNumber: orderNumber,
                        deliverNum : deliveryNum,
                        boxNumber  : null,
                        itemNumber : itemNumber
                    })
                    .limit(+quantity)
                    .exec(next);
            }],
            orderBox: function (next, data) {
                OrderBoxDimension.findOne({ masterBox: boxLabel }, next);
            },
            assignItems: ['processingItems', 'orderBox', function (next, data) {
                if (!data.processingItems || !data.processingItems.length) {
                    next('Item not found');
                } else {
                    OrderProcessing.update({ id: und.pluck(data.processingItems, 'id') }, { boxNumber: data.orderBox.id }, next);
                }
            }],
            quantity: ['orderBox', 'assignItems', function (next, data) {
                OrderProcessing.find({
                    locationId : data.location.id,
                    orderNumber: orderNumber,
                    deliverNum : deliveryNum,
                    boxNumber  : data.orderBox.id,
                    itemNumber : itemNumber
                }, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json({
                    orderNumber: data.processingItems[0].orderNumber,
                    itemNumber : data.processingItems[0].itemNumber,
                    quantity   : data.quantity.length,
                    assigned   : data.assignItems.length
                });
            }
        });

    },

    removeFromBox: function (req, res) {

        var boxLabel   = req.param('boxLabel'),
            itemNumber = req.param('itemNumber'),
            quantity   = req.param('quantity') * 1;

        async.auto({
            processingItems: ['orderBox', function (next, data) {
                OrderProcessing
                    .find()
                    .where({
                        boxNumber: data.orderBox.id,
                        itemNumber: itemNumber
                    })
                    .limit(quantity)
                    .exec(next);
            }],
            orderBox: function (next, data) {
                OrderBoxDimension.findOne({ masterBox: boxLabel }, next);
            },
            removeItems: ['processingItems', 'orderBox', function (next, data) {
                OrderProcessing.update({ id: und.pluck(data.processingItems, 'id') }, { boxNumber: null }, next);
            }],
            quantity: ['orderBox', 'removeItems', function (next, data) {
                OrderProcessing.find({ boxNumber: data.orderBox.id, itemNumber: itemNumber }, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json({
                    orderNumber: data.processingItems[0].orderNumber,
                    itemNumber : data.processingItems[0].itemNumber,
                    quantity   : data.quantity.length,
                    removed    : quantity
                });
            }
        });

    },

    removeAll: function (req, res) {

        var boxLabel = req.param('boxLabel');

        async.auto({
            orderBox: function (next, data) {
                OrderBoxDimension.findOne({ masterBox: boxLabel }, next);
            },
            processingItems: ['orderBox', function (next, data) {
                OrderProcessing.update({ boxNumber: data.orderBox.id }, { boxNumber: null }, next);
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                res.send(500, { error: err });
            } else {
                res.json({
                    status: 'ok'
                });
            }
        });

    }

};