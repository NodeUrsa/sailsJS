/**
* BatchDetail.js
* 
* 
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_batch_detail_OPEN',

    attributes: {

        batchId: {
            type: 'Integer'
        },

        locationId: {
            type: 'Integer'
        },

        masterBatchId: {
            type: 'String'
        },

        batchOrderRank: {
            type: 'Integer'
        },

        docNumber: {
            type: 'String'
        },

        deliveryNumb: {
            type: 'String'
        },

        orderType: {
            type: 'Integer'
        },

        orderSubType: {
            type: 'Integer'
        },

        orderStage: {
            type: 'Integer'
        },

        binLocation: {
            type: 'String'
        },

        checkedOut: {
            type: 'Boolean'
        },

        checkedTime: {
            type: 'String'
        },

        quadrant: {
            type: 'String'
        },

        driverName: {
            type: 'String'
        },

        driverSignature: {
            type: 'String'
        }

    },

    afterDestroy: function (destroyedRecords, cb) {
        async.map(destroyedRecords, function (bDetail, next) {
            OrderList.destroy({
                orderNumber: bDetail.docNumber,
                deliveryNum: bDetail.deliveryNumb
            }, next);
        }, cb);
    }

};

