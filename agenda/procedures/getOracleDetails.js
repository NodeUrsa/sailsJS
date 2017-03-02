var oracle = require('oracle'),
    config = require('../config/oracle'),
    und    = require('underscore'),
    timer  = require('simple-timer');

module.exports = {

    execute: function (done, branchId) {
        var tempId = 'dbmd' + und.random(1000000);
        oracle.connect(config, function (err, connection) {
            if (err) return done(err);
            timer.start(tempId);
            console.log('[ AGENDA ] fetching details for branch ID %s', branchId);
            connection.execute('SELECT * FROM xxwh.xxgen_shipping_details_v WHERE BRANCHID = ' + branchId, [], function (err, results) {
                if (err) { console.log(err); return done(err); }
                timer.stop(tempId);
                connection.close();
                console.log('[ AGENDA ] received details for branch ID %s. %s items fetched for %s sec.', branchId, results.length, timer.get(tempId).delta / 1000);
                done(null, results);
            });
        });
    }

};