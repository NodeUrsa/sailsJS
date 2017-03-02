/**
* OrderMatrix.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_order_matrix_MAIN',

    autoCreatedAt: false,

    autoUpdatedAt: false,

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

        ranking: {
            type: 'integer',
            required: true
        }

    }

};