/**
 * JobController
 *
 * @description :: Server-side logic for managing Jobs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Agenda = require('agenda'),
    agenda = new Agenda({ db: { address: 'localhost:27017/warehouse-agenda' } });

module.exports = {
    index: function (req, res) {
        res.view('job/main');
    },
    list: function (req, res) {
        agenda.jobs (function(err,jobs) {
            if (!err) {
                res.json(jobs);
            } else {
                res.json(err);
            }
        });
    },

    start: function (req, res) {

        // var time = req.param('time');
        var time = /([\d]+)(\w.+)/.exec(req.param('time'))[1]+' '+(/([\d]+)(\w.+)/.exec(req.param('time'))[2]);
        var jobName = req.param('job');

        if(time && jobName) {
            agenda.jobs({ name: jobName }, function(err,jobs){
                var job1 = jobs[0];
                job1.repeatEvery(time);
                job1.save(function(err){
                    job1.run(function(err){
                        if(!err){
                            res.json(job1.toJSON());
                        } else {
                            res.json(err);
                        }
                    })
                });
            })
        } else {
            res.send(404);            
        }

    },

    stop: function (req, res) {

        var jobName = req.param('job');

        if( jobName ) {
            agenda.jobs ({ name: jobName }, function(err,jobs) {

                var job1 = jobs[0];
                job1.remove(function(err){
                    if(!err){
                        var newjob1 = agenda.create(jobName);
                        newjob1.save(function(err){
                            if(!err){
                                res.json(newjob1.toJSON())
                            }else{
                                res.json(err);
                            }
                        });
                    } else {
                        res.send(err);
                    }
                });
            });

        } else {
            res.send(404);            
        }

    },

    changeTime: function (req, res) {

        var time = req.param('time');
        if(time){
            agenda.jobs ({name : 'job1 long name' }, function(err,jobs) {
                var job1 = jobs[0];
                job1.repeatEvery(time);
                job1.save();
                res.json(job1);
            });
        } else {
            res.send(404);
        }
    },
    
    removeAll: function (req, res) {

        // agenda._db.remove (function (err){
        //     res.send('removed')
        // });
        agenda.purge(function(err, numRemoved) {
            res.send(numRemoved)
        });
    }

};

