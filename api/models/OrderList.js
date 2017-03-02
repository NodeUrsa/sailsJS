/**
* OrderList.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_orderList_WORK',

    attributes: {

        locationId: {
            type: 'integer'
        },

        orderNumber: {
            type: 'string'
        },

        deliveryNum: {
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
            type: 'string'
        },

        allocatedQuantity: {
            type: 'integer'
        },

        cancelledQuantity: {
            type: 'integer'
        },

        shortageQuantity: {
            type: 'integer'
        },

        pickedQuantity: {
            type: 'integer'
        },

        packedQuantity: {
            type: 'integer'
        },

        quadrant: {
            type: 'string'
        },

        boxNumber: {
            type: 'string'
        },

        palletNumber: {
            type: 'integer'
        }

    }

};