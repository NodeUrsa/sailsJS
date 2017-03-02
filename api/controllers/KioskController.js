/**
 * KioskController
 *
 * @description :: Server-side logic for managing kiosks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var und    = require('underscore'),
    moment = require('moment');

function nextWrapper (next) {
    return function (err, data) {
        if (err) {
            next(err);
        } else if (!data) {
            next('Not found.');
        } else {
            next(null, data);
        }
    };
}

function pickupTime (releasedDate, det, cutoffpickuptimes) {

     var releasedDateFormated = moment(releasedDate).format('Hmm'), 
         cutOffs = und.map(cutoffpickuptimes,function(item){
            return { cutoff : moment(new Date('1970-01-01 '+item.cutoff)).format('Hmm'), pickup: item.pickup };
         }),
         findPickTime =  und.find(und.sortBy(cutOffs,'cutoff'),function(item){
            return item.cutoff >= releasedDateFormated;
         });

     if(findPickTime){
        return findPickTime.pickup;
     } else {
        return und.last(und.sortBy(cutOffs,'cutoff')).pickup;
     }
}

module.exports = {

    index: function (req, res) {

        res.view('kiosk/main');

    },

    customers: function (req, res) {
        
        var token = req.cookies.eq_token; 

        if (token) {
            async.auto({
                equipment: function (next, data) {
                    Equipment.findOne({ token : token }, nextWrapper(next));
                },
                details: ['equipment', function (next, data) {
                    BatchDetail.find({
                        locationId: data.equipment.locationId,
                        orderStage: [1,2,3,4]
                    }, nextWrapper(next));
                }],
                location: ['equipment', function (next, data) {
                    Location.findOne(data.equipment.locationId, nextWrapper(next));
                }],
                headers: ['details', 'location', function (next, data) {
                    Header 
                        .find({ orderType : 1 })
                        .where({ branchId : data.location.branchId })
                        .where({ deliveryNum: und.pluck(data.details, 'deliveryNumb') })
                        .sort('customerName')
                        .exec(nextWrapper(next));
                }]
            }, function (err, data) {
                var customers = [];
                if (err) {
                    console.log(err);
                    res.send(500, { error: err });
                } else {
                    und.each(data.headers, function (header) {
                        customers.push(und.pick(header, 'id', 'customerNumber', 'customerName', 'shipToCity', 'shipToState', 'shipToZip'));
                    });
                    res.json(und.map(und.groupBy(customers, function (item) {
                        return item.customerNumber;
                    }), function (grouped) {
                        return grouped[0];
                    }));
                }
            });
        } else { 
            res.send(404);
        }
    
    },

    orders: function (req, res) {

        var token             = req.cookies.eq_token;
            customerNumber    = req.param('id');

        if (token && customerNumber) {
            async.auto({
                equipment: function (next, data) {
                    Equipment.findOne({ token : token }, nextWrapper(next));
                },
                location: ['equipment', function (next, data) {
                    Location.findOne(data.equipment.locationId, nextWrapper(next));
                }],
                headers: ['location', function (next, data) {
                    Header
                        .find()
                        .where({ customerNumber : customerNumber })
                        .where({ branchId : data.location.branchId })
                        .exec(nextWrapper(next));
                }],
                details: ['headers', function (next, data) {
                    BatchDetail
                        .find()
                        .where({ deliveryNumb: und.pluck(data.headers, 'deliveryNum') })
                        .where({ locationId : data.equipment.locationId })
                        .where({ orderStage: [1,2,3,4] })
                        .exec(nextWrapper(next))
                }],
                cutoffpickuptimes: ['details',function (next, data) {
                    OrderCutoffPickup
                        .find()
                        .where({ locationId : und.pluck(data.details, 'locationId') }) 
                        .where({ orderType : und.pluck(data.details, 'orderType') })
                        .where({ orderTypeId : { not : null } })
                        .exec(nextWrapper(next))
                }]
            }, function (err, data){

                var headersDeliveryNumb =  und.pluck(data.details, 'deliveryNumb');
                var orderStages = { 1 : 'Picking', 2 : 'Packing', 3 : 'Wrapping', 4 : 'Ship Ready', 5: 'Cancelled' };
                
                detOut = und.filter(data.headers,function(v){
                    return und.find(headersDeliveryNumb,function(num){
                        if(num === v.deliveryNum){
                            return true;
                        }
                    });
                });

                for (var i = 0; i < detOut.length; i++) {
                    var det                 = und.findWhere(data.details, { deliveryNumb: detOut[i].deliveryNum });
                    detOut[i].binLocation   = det.binLocation + '-' + det.quadrant;
                    detOut[i].orderStage    = orderStages[det.orderStage];
                    detOut[i].locationInfo  = und.pick(data.location, 'name','address','city','state','zip');
                    detOut[i].pickupTime    = !!data.cutoffpickuptimes.length ? pickupTime(detOut[i].releasedDate, det, data.cutoffpickuptimes):'12:00:00';
                }

                res.json(detOut);
            })
        } else {
            res.send(404);
        }
    
    },
 
    details: function (req, res) {

        Detail
            .find()
            .where({ deliveryNum: req.param('deliveryNum') })
            .exec(function (err, details) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else if (!details.length) {
                    res.send(404);
                } else {
                    res.json(details);
                }
            });
    
    },

    driverinfo: function (req, res) {
    
        if (req.body.orders && !!req.body.orders.length){
            var deliverNums = und.map(req.body.orders,function(item){
                return item.deliverNum;
            });
            BatchDetail
                .update({ deliveryNumb : deliverNums}, {
                    driverName      :  req.body.driverName,
                    driverSignature :  req.body.driverSignature,
                    orderStage      : 5,
                    checkedOut      : true,
                    checkedTime     : moment(new Date).format('HH:mm:ss')
                })
                .exec(function (err, bds) {
                    if (!err) {
                        if (bds.length === req.body.orders.length) {
                            res.send(200);
                        } else {
                            console.log('BatchDetail with specified `deliveryNumb` = '+deliverNums+' not found.');
                            res.send(404)
                        }
                    } else {
                        res.send(500);
                    }
                });
        } else {
            res.send(404);
        }
    
    },

    print: function (req, res) {
    
        var inOrders       = '',
            deliverNums    = '';

        if (req.body.orders && !!req.body.orders.length) {
            
            und.each(req.body.orders, function(item, i, list) {                
                if (i === (list.length - 1)) {
                    deliverNums += '\''+item.deliverNum +'\'';
                    inOrders += '\''+item.orderNumber +'\'';
                } else {
                    deliverNums += '\''+item.deliverNum +'\' , ';
                    inOrders += '\''+item.orderNumber +'\' , ';
                }
            });
            
            var selectQuery = 'SELECT *,'+
                              'COUNT(itemNumber) as boxCnt,'+                            
                              'qtyAllocated as qtyCnt FROM xxgen_order_processing_WORK',
                where       = ' WHERE orderNumber in ('+inOrders +') AND deliverNum IN (' + deliverNums + ')',
                groupBy     = ' GROUP BY itemNumber,orderNumber';

            OrderProcessing.query(selectQuery + where + groupBy, function (err, items) {  
                if (!err) {
                    var procItems = und.map(items,function(item){
                        return und.pick(item,'itemNumber','orderNumber','customerItemNumber','boxNumber','palletNumber','boxCnt','qtyCnt');
                    });
                    res.json(und.groupBy(procItems, function(item) {
                        return item.orderNumber;
                    }))
                } else {
                    res.send(500);                 
                }
            });

        } else {
            res.send(404)
        }

    }

};

module.exports.blueprints = {
    actions: true,
    rest: false,
    shortcuts: false
};