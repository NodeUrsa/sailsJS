var oracle = require('oracle'),
    config = require('../config/oracle'),
    und    = require('underscore'),
    timer  = require('simple-timer');

module.exports = {

    execute: function (done, branchId) {
        var tempId = 'dbmh' + und.random(1000000);
        oracle.connect(config, function (err, connection) {
            if (err) return done(err);
            timer.start(tempId);
            console.log('[ AGENDA ] fetching headers for branch ID %s', branchId);
            connection.execute('SELECT * FROM xxwh.xxgen_shipping_headers_v WHERE BRANCHID = ' + branchId, [], function (err, results) {
                if (err) { console.log(err); return done(err); }
                timer.stop(tempId);
                connection.close();
                console.log('[ AGENDA ] received headers for branch ID %s. %s items fetched for %s sec.', branchId, results.length, timer.get(tempId).delta / 1000);
                done(null, results);
            });
        });
    }

};