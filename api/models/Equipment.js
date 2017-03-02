/**
* Equipment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
//

var rt = require('rand-token');

module.exports = {

    schema: true,

    tableName: 'xxgen_equipment_access_MAIN',

    attributes: {

        locationId: {
            model: 'Location'
        },

        equipmentType: {
            type: 'Integer'
        },

        description: {
            type: 'String'
        },

        token: {
            type: 'String'
        },

        status: {
            type: 'Integer'
        },
        
        used: {
            type: 'Boolean'
        },

        createdBy: {
            type: 'Integer'
        }

    },

    beforeCreate: function (user, cb) {
        user.token = rt.generate(6,'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        cb(null, user);
    }

};
