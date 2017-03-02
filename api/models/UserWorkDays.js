/**
* UserWorkDays.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_user_workdays_MAIN',

    autoCreatedAt: false,

    autoUpdatedAt: false,

    attributes: {

        sunday: {
            type: 'boolean',
            required: true
        },

        monday: {
            type: 'boolean',
            required: true
        },

        tuesday: {
            type: 'boolean',
            required: true
        },

        wednesday: {
            type: 'boolean',
            required: true
        },

        thursday: {
            type: 'boolean',
            required: true
        },

        friday: {
            type: 'boolean',
            required: true
        },

        saturday: {
            type: 'boolean',
            required: true
        }

    }
};