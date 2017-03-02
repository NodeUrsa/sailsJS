var Agenda           = require('agenda');

// Procedures
var getOracleHeaders = require('./procedures/getOracleHeaders'),
    saveMySQLHeaders = require('./procedures/saveMysqlHeaders'),
    getOracleDetails = require('./procedures/getOracleDetails'),
    saveMySQLDetails = require('./procedures/saveMysqlDetails');

var agenda = new Agenda({ db: { address: 'localhost:27017/warehouse' }});

agenda.purge(function () {

});

agenda.define('db:migrate:headers', function (job, done) {

    getOracleHeaders.execute(function (err, oracleHeaders) {

        if (err) { console.log(err); return done(); }

        saveMySQLHeaders.execute(function () {
            console.log('Success!');
            done();
        }, oracleHeaders);

    });

});

agenda.every('1 minute', 'db:migrate:headers');

agenda.start();