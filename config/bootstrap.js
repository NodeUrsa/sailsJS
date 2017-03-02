/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var path    = require('path'),
    fs      = require('fs'),
    Agenda  = require('agenda'),
    agenda  = new Agenda({ db: { address: 'localhost:27017/warehouse-agenda' }});

module.exports.bootstrap = function(cb) {
    
        // agenda._db.remove( function() {
        //     agenda.processEvery('1 second');
        //     agenda.maxConcurrency(100);
        //     var app_home_path   = path.dirname(__dirname),
        //     app_agenda_path     = app_home_path+'/agenda/jobs',
        //     jobs_legth = 0;
        //     fs.readdir (app_agenda_path, function (err,jobs) {
        //         if (!err) {
        //             if (jobs) {
        //                 jobs_legth = jobs.length;
        //                 jobs.forEach (function (file) {
        //                     require(app_agenda_path+path.sep+file)(agenda);
        //                 });
        //                 if (jobs_legth) {
        //                     agenda.start();
        //                 }
        //                 cb();
        //             } else {
        //                 cb();
        //             }
        //         } else {
        //             cb(err);
        //         }
        //     });
        // });
        cb();
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
};
