/**
* BatchHeader.js
*
* @property batchStatus: Represent the status of the batch
* 0 - Inactive
* 1 - Waiting
* 2 - Processing
*
* @property batchType: This field will be used by the system to direct resources based on the Balance Queue calculation
* 1 - Outgoing
* 2 - Incoming
* 
* @property batchProcessType:
* 1 - Exception (1st priority)
* 2 - Transfer (2nd priority)
* 3 - Normal
*
* @property batchStage: This field will hold the stage in which the batch is
* 1 – Picking
* 2 – Packing
* 3 – Wrapping
* 4 - Restocking
* 5 – Ready
* 6 – Posted
*
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_batch_header_OPEN',

    attributes: {

        locationId: {
            model: 'Location'
        },

        userId: {
            type: 'integer'
        },

        masterBatchId: {
            type: 'string'
        },

        batchStatus: {
            type: 'integer'
        },

        batchType: {
            type: 'integer'
        },

        batchStage: {
            type: 'integer'
        },

        batchProcessType: {
            type: 'integer'
        },

        orderType: {
            model: 'OrderType'
        },

        transferLocation: {
            type: 'String'
        },

        transferNoticed: {
            type: 'Boolean'
        }

    },

    afterDestroy: function (destroyedRecords, cb) {
        async.parallel([
            function (next) {
                async.map(destroyedRecords, function (bHeader, next) {
                    BatchDetail.destroy({
                        masterBatchId: bHeader.masterBatchId
                    }, next);
                }, next);
            },
            function (next) {
                async.map(destroyedRecords, function (bHeader, next) {
                    QueueBalance.destroy({
                        batchId: bHeader.id
                    }, next);
                }, next);
            }
        ], cb);
    }

};