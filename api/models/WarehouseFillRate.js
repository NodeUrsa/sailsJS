/**
* WarehouseFillRate.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_warehouse_fillrate_MAIN',

    autoCreatedAt: false,

    autoUpdatedAt: false,

    attributes: {

        date: {
            type: 'string',
            required: true
        },

        locationId: {
            type: 'integer',
            required: true
        },

        rate: {
            type: 'string',
            required: true
        }

    }

};