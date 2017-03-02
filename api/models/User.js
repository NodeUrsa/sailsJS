/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var md5 = require('blueimp-md5').md5;

module.exports = {

    schema: true,

    tableName: 'xxgen_user_MAIN',

    attributes: {

        userName: {
            type: 'String',
            unique : true,
            required: true
        },

        firstName: {
            type: 'String',
            required: true
        },

        lastName: {
            type: 'String',
            required: true
        },

        password: {
            type: 'String'
        },

        locationId: {
            model: 'Location'
        },

        active: {
            type: 'Boolean',
            defaultsTo: false
            // required: true
        },

        willcallPick: {
            type: 'Boolean'
        },

        willcallPack: {
            type: 'Boolean'
        },

        expressPick: {
            type: 'Boolean'
        },

        expressPack: {
            type: 'Boolean'
        },

        truckPick: {
            type: 'Boolean'
        },

        truckPack: {
            type: 'Boolean'
        },

        shipRestock: {
            type: 'Boolean'
        },

        role: {
            type: 'Integer',
            required: true
        },

        operationStartHour: {
            type: 'String'
        },

        operationEndHour: {
            type: 'String'
        },

        busy: {
            type: 'Boolean'
        },

        lastLogin: {
            type: 'String'
        },

        expired: {
            type: 'Boolean'
        },

        expiredAt: {
            type: 'String'
        },

        credentialsExpired: {
            type: 'Boolean'
        },

        credentialsExpiredAt: {
            type: 'String'
        },

        workDays: {
            model: 'UserWorkDays'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }

    },

    beforeCreate: function (user, cb) {

        UserWorkDays.create({
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false
        }).exec( function (err, result) {
            if (err) {
                cb(err);
            } else {
                user.workDays = result.id;
                user.password = md5(String(user.password));
                cb(null, user);
            }
        });
                        
    },

    beforeUpdate: function (user, cb) {
        
        if (user.password === undefined || !user.password) {
            cb(null,user);
        } else if(user.workDays) {
            cb(null,user);
        } else {
            user.password = md5(String(user.password));
            cb(null, user);
        }

    }

};
