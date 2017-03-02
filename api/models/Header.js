/**
* Header.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'xxgen_header_WORK',

    schema: true,

    attributes: {

        oracleId: {
            type: 'integer'
        },

        overallRank: {
            type: 'integer'
        },

        branchId: {
            type: 'integer'
        },

        cancelStatus: {
            type: 'boolean'
        },

        orderGroup: {
            type: 'integer'
        },

        orderType: {
            type: 'integer'
        },

        orderSubType: {
            type: 'integer'
        },

        branchName: {
            type: 'string'
        },

        origOrderNumber: {
            type: 'integer'
        },

        customerGroup: {
            type: 'string'
        },

        customerNumber: {
            type: 'string'
        },

        customerName: {
            type: 'string'
        },

        customerRank: {
            type: 'string'
        },

        shipToAddress1: {
            type: 'string'
        },

        shipToAddress2: {
            type: 'string'
        },

        shipToAddress3: {
            type: 'string'
        },

        shipToAddress4: {
            type: 'string'
        },

        shipToCity: {
            type: 'string'
        },

        shipToState: {
            type: 'string'
        },

        shipToZip: {
            type: 'string'
        },

        billToAddress1: {
            type: 'string'
        },

        billToAddress2: {
            type: 'string'
        },

        billToAddress3: {
            type: 'string'
        },

        billToAddress4: {
            type: 'string'
        },

        billToCity: {
            type: 'string'
        },

        billToState: {
            type: 'string'
        },

        billToZip: {
            type: 'string'
        },

        orderNumber: {
            type: 'string'
        },

        deliveryNum: {
            type: 'string'
        },

        orderDate: {
            type: 'string'
        },

        dueDate: {
            type: 'string'
        },

        releasedDate: {
            type: 'string'
        },

        remarks: {
            type: 'string'
        },

        poNum: {
            type: 'string'
        },

        createdBy: {
            type: 'string'
        },

        shipVia: {
            type: 'string'
        },

        carrier: {
            type: 'string'
        },

        updatedShipvia: {
            type: 'string'
        },

        freightTerms: {
            type: 'string'
        },

        poAmount: {
            type: 'string'
        },

        soAmount: {
            type: 'string'
        },

        cbf: {
            type: 'string'
        },

        weight: {
            type: 'string'
        },

        pieces: {
            type: 'integer'
        }

    },

    afterDestroy: function (destroyedRecords, cb) {
        async.map(destroyedRecords, function (header, next) {
            Detail.destroy({
                orderNumber: header.orderNumber,
                deliveryNum: header.deliveryNum
            }, next);
        }, cb);
    }

};