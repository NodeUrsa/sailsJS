/**
* Detail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    tableName: 'xxgen_detail_WORK',

    schema: true,

    attributes: {

        oracleId: {
            type: 'integer'
        },

        branchId: {
            type: 'integer'
        },

        orderNumber: {
            type: 'string'
        },

        deliveryNum: {
            type: 'string'
        },

        customerItemNumber: {
            type: 'string'
        },

        lineNumber: {
            type: 'string'
        },

        itemNumber: {
            type: 'string'
        },

        locator: {
            type: 'string'
        },

        stdpk: {
            type: 'integer'
        },

        allocatedQuantity: {
            type: 'integer'
        },

        cancelledQuantity: {
            type: 'integer'
        },

        itemDescription: {
            type: 'string'
        }

    }

};