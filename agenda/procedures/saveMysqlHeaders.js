var headerSchema = require('../schemas/header'),
    und          = require('underscore'),
    util         = require('../helpers/util'),
    moment       = require('moment');

module.exports = {

    execute: function (done, oracleHeaders, mysqlHeaders) {
        und.each(oracleHeaders, function (header) {
            var oracleHeader   = util.normalizeModel(header, headerSchema);
            oracleHeader.orderDate = moment(oracleHeader.orderDate).format('YYYY-MM-DD HH:mm:ss');
            oracleHeader.dueDate = moment(oracleHeader.dueDate).format('YYYY-MM-DD HH:mm:ss');
            oracleHeader.releasedDate = moment(oracleHeader.releasedDate).format('YYYY-MM-DD HH:mm:ss');
            mysqlHeaders.update({ oracleId: oracleHeader.oracleId }, oracleHeader).exec(function (err, data) {
                if (err) { console.log(err); return; }
                if (!data.length) {
                    mysqlHeaders.create(oracleHeader).exec(function (err, data) {
                        if (err) { console.log(err); }
                    });
                }
            });
        });
        done();
    }

};