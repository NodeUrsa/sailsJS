/**
 * OrderTypeController
 *
 * @description :: Server-side logic for managing Ordertypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	destroy: function (req,res) {

		OrderType.destroy(req.params.id)
			.exec(function (err, dbFindOrderType) {
				if (!err) {
					if (!!dbFindOrderType.length) {

						var _orderType  = dbFindOrderType[0].orderType,
						_orderSubType   = dbFindOrderType[0].orderSubType,
						_locationId     = dbFindOrderType[0].locationId;
						
						OrderMatrix
							.destroy({ orderType : _orderType, orderSubType : _orderSubType, locationId : _locationId })
							.exec(function (err, dbFindOrderMatrix) {
							if (!err) {			
								if (!!dbFindOrderMatrix.length) {
									var _moreRanking = dbFindOrderMatrix[0].ranking;
									OrderMatrix
										.find({ ranking : {'>': _moreRanking }, locationId : _locationId })
										.exec(function (err, dbFindOrderTypes) {
											if (!!dbFindOrderTypes.length) {
												for(var i = 0; i < dbFindOrderTypes.length; i++) {
													dbFindOrderTypes[i].ranking -= 1; 
												}
												OrderMatrix
													.destroy({ ranking : {'>': _moreRanking }, locationId : _locationId })
													.exec(function (err, dbDestroyOrderMatrixes) {
														OrderMatrix
															.create(dbFindOrderTypes)
															.exec(function (err, dbCreteOrderMatrixes) {
																if (!err) {
																	res.send(dbFindOrderType[0]);
																} else {
																	res.send(500);								
																}
															});
													});
											} else {
												res.send(500,{error : err});								
											}
										});
								} else {
									res.send(dbFindOrderType[0]);
								}
							} else {
								if (dbFindOrderType[0]) {
									res.send(dbFindOrderType[0]);
								} else {
									res.send(500,{error : err});								
								}
							}
						});
					} else {
						res.send('No record found with the specified `id`.')
					}
				} else {
					res.send(500,{error : err});								
				}
			});
	}
};

