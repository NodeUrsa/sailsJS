/**
 * OrderProcessing.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    
    schema: true,

    tableName: 'xxgen_order_processing_WORK',

    attributes: {

        locationId: {
            type: 'Integer'
        },

        orderType: {
            type: 'Integer'
        },

        orderSubType: {
            type: 'Integer'
        },

        orderNumber: {
            type: 'String'
        },

        deliverNum: {
            type: 'String'
        },

        itemNumber: {
            type: 'String'
        },

        itemDescription: {
            type: 'String'
        },

        customerItemNumber: {
            type: 'String'
        },

        locator: {
            type: 'String'
        },

        qtyAllocated: {
            type: 'Integer'
        },

        qtyCanceled: {
            type: 'Integer'
        },

        qtyShortage: {
            type: 'Integer'
        },

        qtyPicked: {
            type: 'Integer'
        },

        qtyPacked: {
            type: 'Integer'
        },

        masterBatchId: {
            type: 'String'
        },

        boxNumber: {
            model: 'OrderBoxDimension'
        },

        palletNumber: {
            type: 'Integer'
        },

        scanPickTime: {
            type: 'Datetime'
        },

        pickUserId: {
            type: 'String'
        },

        packLocation: {
            type: 'String'
        },

        packUserId: {
            type: 'String'
        },

        scanPackTime: {
            type: 'Datetime'
        },

        startWrapTime: {
            type: 'Datetime'
        },

        endWrapTime: {
            type: 'Datetime'
        },
        status: {
            type: 'Boolean'
        }
    }
};
