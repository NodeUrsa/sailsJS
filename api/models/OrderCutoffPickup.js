/**
* OrderCutoffPickup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    // schema: true,

    autoCreatedAt: false,

    autoUpdatedAt: false,
    // autoPK: false,
    tableName: 'xxgen_order_type_cutoff_pickup_MAIN',
    
    attributes: {

        locationId: {
             // model: 'Location'
            type: 'Integer'
        },
        
        orderTypeId : {
            model: 'OrderType'
        },

        orderType: {
            // model: 'OrderType'
            type: 'Integer'
        },
        
        orderSubType: {
            type: 'Integer'
        },

        cutoff: {
            type: 'String'
        },

        pickup: {
            type: 'String'
        }

    }
};

