var detailSchema = require('../schemas/detail'),
    und          = require('underscore'),
    util         = require('../helpers/util');

module.exports = {

    execute: function (done, oracleDetails, mysqlDetails) {
        und.each(oracleDetails, function (detail) {
            var oracleDetail   = util.normalizeModel(detail, detailSchema);
            mysqlDetails.update({ oracleId: oracleDetail.oracleId }, oracleDetail).exec(function (err, data) {
                if (err) { console.log(err); return; }
                if (!data.length) {
                    mysqlDetails.create(oracleDetail).exec(function (err, data) {
                        if (err) { console.log(err); }
                    });
                }
            });
        });
        done();
    }

};