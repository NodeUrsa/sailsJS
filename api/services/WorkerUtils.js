var moment = require('moment'),
    und    = require('underscore');

module.exports = {

    pick: function (data, cb) {
        // data
        //
        // data.item
        // data.item.id
        //
        // data.item
        // data.item.pn
        // data.item.orderNumber
        // data.item.deliveryNum
        //
        // data.location
        //
        // data.user
        //
        // data.quantity
        if (false) {
            cb('item and quantity are required');
        } else {
            async.auto({
                orderListItem: function (next, asyncData) {
                    if (data.item.id) {
                        OrderList.findOne(data.item.id, next);
                    } else if (data.item.pn) {
                        OrderList.findOne({
                            itemNumber  : data.item.pn,
                            locationId  : data.location.id,
                            orderNumber : data.item.orderNumber,
                            deliveryNum : data.item.deliveryNum
                        }, next);
                    } else {
                        next('Item is invalid');
                    }
                },
                batchDetail: ['orderListItem', function (next, asyncData) {
                    BatchDetail.findOne({
                        locationId   : data.location.id,
                        docNumber    : asyncData.orderListItem.orderNumber,
                        deliveryNumb : asyncData.orderListItem.deliveryNum
                    }, next);
                }],
                detail: ['orderListItem', function (next, asyncData) {
                    Detail.findOne({
                        itemNumber  : asyncData.orderListItem.itemNumber,
                        branchId    : data.location.branchId,
                        orderNumber : asyncData.orderListItem.orderNumber,
                        deliveryNum : asyncData.orderListItem.deliveryNum
                    }, next);
                }],
                update: ['orderListItem', function (next, asyncData) {
                    if (asyncData.orderListItem.shortageQuantity) {
                        asyncData.orderListItem.pickedQuantity   = Number(asyncData.orderListItem.pickedQuantity) + Number(data.quantity);
                        asyncData.orderListItem.shortageQuantity = Number(asyncData.orderListItem.shortageQuantity) - Number(data.quantity);
                    }
                    OrderList.update(asyncData.orderListItem.id, {
                        pickedQuantity: asyncData.orderListItem.pickedQuantity,
                        shortageQuantity: asyncData.orderListItem.shortageQuantity
                    }, next);
                }],
                processing: ['orderListItem', 'batchDetail', 'detail', function (next, asyncData) {
                    var processingItems = [];
                    und.times(data.quantity, function () {
                        processingItems.push({
                            locationId         : data.location.id,
                            orderType          : asyncData.batchDetail.orderType,
                            orderSubType       : asyncData.batchDetail.orderSubType,
                            orderNumber        : asyncData.batchDetail.docNumber,
                            deliverNum         : asyncData.orderListItem.deliveryNum,
                            itemNumber         : asyncData.orderListItem.itemNumber,
                            itemDescription    : asyncData.detail.itemDescription,
                            customerItemNumber : asyncData.detail.customerItemNumber,
                            locator            : asyncData.orderListItem.locator,
                            qtyAllocated       : asyncData.orderListItem.allocatedQuantity,
                            qtyCanceled        : asyncData.orderListItem.cancelledQuantity,
                            qtyShortage        : asyncData.orderListItem.shortageQuantity,
                            qtyPicked          : 1,
                            qtyPacked          : 0,
                            masterBatchId      : asyncData.batchDetail.masterBatchId,
                            boxNumber          : null,
                            palletNumber       : 1,
                            scanPickTime       : new Date(),
                            pickUserId         : data.user.id,
                            packLocation       : null,
                            packUserId         : null,
                            scanPackTime       : null,
                            startWrapTime      : null,
                            endWrapTime        : null,
                            status             : 0
                        });
                    });
                    OrderProcessing.create(processingItems, next);
                }]
            }, cb);
        }
    },

    pack: function (data, cb) {
        // data
        //
        // data.item
        // data.item.id
        //
        // data.item
        // data.item.pn
        // data.item.orderNumber
        // data.item.deliveryNum
        //
        // data.location
        //
        // data.user
        //
        // data.quantity
        if (false) {
            cb('item and quantity are required');
        } else {
            async.auto({
                orderListItem: function (next, asyncData) {
                    if (data.item.id) {
                        OrderList.findOne(data.item.id, next);
                    } else if (data.item.pn) {
                        OrderList.findOne({
                            itemNumber  : data.item.pn,
                            locationId  : data.location.id,
                            orderNumber : data.item.orderNumber,
                            deliveryNum : data.item.deliveryNum
                        }, next);
                    } else {
                        next('Item is invalid');
                    }
                },
                batchDetail: ['orderListItem', function (next, asyncData) {
                    BatchDetail.findOne({
                        locationId   : data.location.id,
                        docNumber    : asyncData.orderListItem.orderNumber,
                        deliveryNumb : asyncData.orderListItem.deliveryNum
                    }, next);
                }],
                update: ['orderListItem', function (next, asyncData) {
                    if (asyncData.orderListItem.pickedQuantity) {
                        asyncData.orderListItem.packedQuantity = Number(asyncData.orderListItem.packedQuantity) + Number(data.quantity);
                    }
                    OrderList.update(asyncData.orderListItem.id, {
                        packedQuantity: asyncData.orderListItem.packedQuantity
                    }, next);
                }],
                processing: ['orderListItem', 'batchDetail', function (next, asyncData) {
                    OrderProcessing.update({
                        locationId: data.location.id,
                        deliverNum: asyncData.orderListItem.deliveryNum,
                        itemNumber: asyncData.orderListItem.itemNumber,
                        qtyPicked: 1,
                        qtyPacked: 0,
                        masterBatchId: asyncData.batchDetail.masterBatchId
                    }, {
                        qtyPacked: 1,
                        scanPackTime: new Date(),
                        packUserId: data.user.id
                    }).limit(+data.quantity).exec(next);
                }]
            }, cb);
        }
    }

};