/**
* OrderType.js
* 
* combineBy:
* 1 - Pieces (items)
* 2 - Orders
* 3 - Volume (cubic feet)
*
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_order_type_MAIN',

    attributes: {

        locationId: {
            type: 'integer',
            required: true
        },

        orderType: {
            type: 'integer',
            required: true
        },

        orderSubType: {
            type: 'integer'
        },

        activated: {
            type: 'boolean'
        },

        name: {
            type: 'string',
            required: true
        },

        shortName: {
            type: 'string',
            required: true
        },

        referenceId: {
            type: 'integer'
        },

        combineByItems: {
            type: 'boolean'
        },

        combineByOrders: {
            type: 'boolean'
        },

        combineByCbf: {
            type: 'boolean'
        },

        combineByItemsNumber: {
            type: 'integer'
        },

        combineByOrdersNumber: {
            type: 'integer'
        },

        combineByCbfNumber: {
            type: 'integer'
        },

        splitFlag: {
            type: 'boolean'
        },

        splitByItems: {
            type: 'boolean'
        },

        splitBySales: {
            type: 'boolean'
        },

        splitByCbf: {
            type: 'boolean'
        },

        splitByItemsNumber: {
            type: 'integer'
        },

        splitBySalesNumber: {
            type: 'integer'
        },

        splitByCbfNumber: {
            type: 'integer'
        },

        freightFlag: {
            type: 'boolean'
        },

        multiplePackFlag: {
            type: 'boolean'
        },

        numberDocks: {
            type: 'integer'
        },

        startAfterNumbOrder: {
            type: 'integer'
        },

        binLocationFlag: {
            type: 'boolean'
        },

        binLocation: {
            type: 'integer'
        },

        pickPackFlag: {
            type: 'boolean'
        },

        wrapFlag: {
            type: 'boolean'
        },

        avgOrderPickTime: {
            type: 'string'
        },

        avgOrderPackTime: {
            type: 'string'
        },

        avgOrderWrapTime: {
            type: 'string'
        },

        avgPieces: {
            type: 'integer'
        },

        avgSalesAmt: {
            type: 'string'
        },

        numberOrders: {
            type: 'string'
        },

        numberItems: {
            type: 'integer'
        },

        expressMixModeFlag: {
            type: 'boolean'
        },

        mixOrderTypeFlag: {
            type: 'boolean'
        },

        boxDimensionFlag: {
            type: 'boolean'
        },

        expGroup1Items: {
            type: 'integer'
        },

        expGroup1Orders: {
            type: 'integer'
        },

        expGroup1Maxvolume: {
            type: 'string'
        },

        expGroup1Qdr: {
            type: 'integer'
        },

        expGroup2Items: {
            type: 'integer'
        },

        expGroup2Orders: {
            type: 'integer'
        },

        expGroup2Maxvolume: {
            type: 'string'
        },

        expGroup2Qdr: {
            type: 'integer'
        },

        expGroup3Items: {
            type: 'integer'
        },

        expGroup3Orders: {
            type: 'integer'
        },

        expGroup3Maxvolume: {
            type: 'string'
        },

        expGroup3Qdr: {
            type: 'integer'
        },

        expGroup4Items: {
            type: 'integer'
        },

        expGroup4Orders: {
            type: 'integer'
        },

        expGroup4Maxvolume: {
            type: 'string'
        },

        expGroup4Qdr: {
            type: 'integer'
        },

        managerAccess: {
            type: 'boolean'
        },

        cutOffPickup: {
            collection: 'OrderCutoffPickup',
            via: 'orderTypeId'
        }        

    }

};