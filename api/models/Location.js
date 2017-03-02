/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_location_MAIN',

    attributes: {

        name: {
            type: 'string',
            // required: true
        },

        shortName: {
            type: 'string',
            // required: true
        },

        branchId: {
            type: 'integer',
            // required: true
        },

        // referenceId: {
        //     type: 'integer'
        // },

        address: {
            type: 'string',
            // required: true
        },

        city: {
            type: 'string',
            // required: true
        },

        state: {
            type: 'string',
            // required: true
        },

        zip: {
            type: 'string',
            // required: true
        },

        phone: {
            type: 'string'
        },

        opsStartHour: {
            type: 'string',
            // required: true
        },

        opsEndHour: {
            type: 'string',
            // required: true
        },

        nextBatchNumber: {
            type: 'integer'
        },

        pickPercentageQueue: {
            type: 'string'
        },

        packPercentageQueue: {
            type: 'string'
        },

        docks: {
            type: 'integer',
            // required: true
        },

        activateLocation: {
            type: 'boolean'
        },

        activateSystem: {
            type: 'boolean'
        },

        exceptionAccess: {
            type: 'boolean'
        },

        fillRate: {
            collection: 'FillRate',
            via: 'locationId'
        }

    }

};