/**
* Calendar.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_calendar_MAIN',

    attributes: {

        locationId: {
            type: 'integer'
        },

        userId: {
            type: 'integer'
        },

        date: {
            type: 'string'
        },

        onOffFlag: {
            type: 'boolean'
        },

        assignment: {
            type: 'string'
        }

    }

};