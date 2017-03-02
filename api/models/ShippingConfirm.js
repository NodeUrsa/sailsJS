/**
* ShippingConfirm.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  
    schema: true,

    tableName: 'xxgen_shipping_confirm_WORK',
    
    attributes: {

        branchId: {
            type: 'Integer',        
        },

        deliveryNumber: {
            type: 'String',
        },

        oracleId: {
            type: 'Integer',
        },

        orderNumber: {
            type: 'String'
        }

    }
};

