//==========================================================================================
//		CHECKOUT ROUTES
//==========================================================================================

var express = require("express"),
	router  = express.Router({mergeParams: true}),
	Order   = require("../models/order"),
	Checkout = require("../models/checkout"),
	Items    = require("../models/item");

router.post("/Order/:qnt", function(req, res){
	var orders = [];
	for(var i = 0; i < req.params.qnt; i++){
		if(req.params.qnt > 1){
		var new_order = 
			{
				name: req.body.items.item_name[i],
				quantity: req.body.items.num[i]
			}		
		} else {
			var new_order = 
			{
				name: req.body.items.item_name,
				quantity: req.body.items.num
			}
		}
		orders.push(new_order);
	}
	// console.log(orders);
	Order.remove({}, function(err){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			orders.forEach(function(curr_order){
				Order.create(curr_order, function(err, order){
					if(err){
						//Handle this error
						console.log(err);
					} else {
						// console.log(order);
						Items.find({name: curr_order.name}, function(err, item){
							if(err){
								//Handle this error
								console.log(err);
							} else {	
								var count = 0;
								curr_order.price = item[0].price;
								curr_order.total_price = curr_order.quantity * curr_order.price;
								// console.log(curr_order);
								order.price = curr_order.price;
								order.total_price = curr_order.total_price;										
								// console.log(order);
								order.save(function(err){
									if(err){
										//Handle this error
										console.log(err);
									} else {										
										// console.log(orders.indexOf(curr_order));										
										if(orders.indexOf(curr_order) === orders.length - 1){
											Checkout.remove({}, function(err){
												if(err){
													//Handle this error
													console.log(err);
												} else {
													Checkout.create({name: "Krishna", email: "krishna@gmail.com"}, function(err, checkout){
														if(err){
															//Handle this error
															console.log(err);
														} else {								
															Order.find({}, function(err, foundOrder){
																if(err){
																	//Handle this error
																	console.log(err);
																} else {
																	foundOrder.forEach(function(order){
																		checkout.orders.push(order);
																	});
																	// console.log(checkout);
																	var total = 0;
																	checkout.orders.forEach(function(indl_order){
																		total += (indl_order.price * indl_order.quantity);
																	});
																	checkout.total = total;
																	checkout.save(function(err){
																		if(err){
																			//Handle this error
																			console.log(err);
																		} else {
																			res.redirect("/Checkout");
																		}
																	});
																}
															});
														}								
													});
												}
											});	
										}										
									}
								});
							}
						});
					}
				});
			});
		}
	});		
});

router.get("/Checkout", function(req, res){
	Checkout.findOne({name: "Krishna"}).populate("orders").exec(function(err, checkout){
		if(err){
			//Handle this error
			console.log(err);
		} else {			
			// console.log(checkout);
			res.render("foodItems/checkout", {checkout: checkout});
		}
	});	
});

module.exports = router;