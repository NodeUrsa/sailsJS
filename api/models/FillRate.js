/**
* FillRate.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

/*
alter table xxgen_fill_rate_MAIN modify fillRatePercentage decimal(5,2);
alter table xxgen_fill_rate_MAIN modify incomingAllocPercentage decimal(5,2);
alter table xxgen_fill_rate_MAIN modify outgoingAllocPercentage decimal(5,2);
*/
module.exports = {

    tableName: 'xxgen_fill_rate_MAIN',

    autoCreatedAt: false,

    autoUpdatedAt: false,

    attributes: {

        locationId: {
            model: 'Location',
            // required: true
        },

        level: {
            type: 'Integer',
            // required: true
        },

        fillRatePercentage: {
            type: 'String',
            // required: true
        },

        incomingAllocPercentage: {
            type: 'String',
            // required: true
        },

        outgoingAllocPercentage: {
            type: 'String',
            // required: true
        }

    }

};