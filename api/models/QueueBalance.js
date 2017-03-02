/**
* QueueBalance.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_queue_balance_WORK',

    autoCreatedAt: false,

    autoUpdatedAt: false,

    attributes: {

        batchId: {
            model: 'BatchHeader'
        },

        locationId: {
            type: 'Integer'
        },

        rankIn: {
            type: 'Integer'
        },

        rankOut: {
            type: 'Integer'
        },

        batchType: {
            type: 'Integer'
        },

        workerActive: {
            type: 'Boolean'
        }

    }

};