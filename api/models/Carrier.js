/**
* Carrier.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

    schema: true,

    tableName: 'xxgen_carrier_MAIN',

    attributes: {

        name: {
            type: 'string'
        },

        orderType: {
            type: 'integer'
        },

        orderSubType: {
            type: 'integer'
        }

    }

};