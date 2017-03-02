/**
* OrderBoxDimension.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    schema: true,

    tableName: 'xxgen_order_box_dimension_WORK',

    attributes: {

        masterBox: {
            type: 'String'
        },

        lengthSize: {
            type: 'Integer'
        },

        widthSize: {
            type: 'Integer'
        },

        heightSize: {
            type: 'Integer'
        },

        override: {
            type: 'Integer'
        },

        freightCost: {
            type: 'String'
        }

    }

};