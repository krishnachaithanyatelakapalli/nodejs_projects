var express 		= require("express"),
	app				= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	methodOverride	= require("method-override");
	
var	seedDB			= require("./seeds"),
	Items			= require("./models/item"),
	Comment 		= require("./models/comment"),
	Checkout 		= require("./models/checkout"),
	Order			= require("./models/order");

var categories = ["Soups", "Sandwiches", "Desserts"];

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/online_canteen", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

seedDB();

//==========================================================================================
//	    ROUTES
//==========================================================================================

// HOME
app.get("/", function(req, res){
	res.render("home");
});


// INDEX - Get all
app.get("/Items", function(req, res){
	Items.find({}, function(err, items){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			res.render("foodItems/index", {items: items, categories: categories});
		}
	});	
});

// CREATE - create new items - only accessable by the manager - login required
app.get("/Items/new", function(req, res){
	res.render("manager/addNew");
});

app.post("/Items/new", function(req, res){
	Items.create(req.body.items, function(err, items){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			res.redirect("/Items");
		}
	});
});

// EDIT - edit existing items - only accessable by the manager - login required
app.get("/Items/:id/edit", function(req, res){
	Items.findById(req.params.id, function(err, item){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			res.render("manager/edit", {item: item});
		}
	});
});

// UPDATE - update the edited item - only accessable by the manager - login required
app.put("/Items/:id/edit", function(req, res){
	Items.findByIdAndUpdate(req.params.id, req.body.items, function(err, item){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			res.redirect("/Items/" + req.params.id);
		}
	});
});

// DELETE - delete an existing item - only accessable by the manager - login required
app.delete("/Items/:id/delete", function(req, res){
	Items.findByIdAndRemove(req.params.id, function(err){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			res.redirect("/Items");
		}
	});
});

// SHOW - show individual
app.get("/Items/:id", function(req, res){
	Items.findById(req.params.id).populate("comments").exec(function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			console.log(item.comments);
			res.render("foodItems/show", {item: item});
		}
	});
});

//==========================================================================================
//		CHECKOUT ROUTES
//==========================================================================================
app.post("/Order/:qnt", function(req, res){	
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
	Checkout.findOne({name: "Bob Marley"}).populate("list").exec(function(err, checkout){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			orders.forEach(function(order){
				Items.findOne({name: order.name}, function(err, foundItem){
					if(err){
						//Handle this error
						console.log(err);
					} else {
						// console.log(foundItem.name);
						order.price = foundItem.price;						
						Order.create(order, function(err, curr_order){
							if(err){
								//Handle this error
								console.log(err);
							} else {
								checkout.list.push(order);
								checkout.save();
								res.render("foodItems/checkout", {checkout: checkout});
							}			
						});
					}
				});				
			});
		}					
	});		
	// res.end();
});

app.get("/Checkout", function(req, res){
	Checkout.findOne({name: "Bob Marley"}).populate("list").exec(function(err, checkout){
		if(err){
			//Handle this error
			console.log(err);
		} else {			
			// console.log(checkout);
			res.render("foodItems/checkout", {checkout: checkout});
		}
	});	
});

//==========================================================================================
//		COMMENTS ROUTES
//==========================================================================================

app.get("/Items/:id/comment/new", function(req, res){
	Items.findById(req.params.id, function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			res.render("comments/new", {item: item});
		}
	});
});

app.post("/Items/:id/comment", function(req, res){
	Items.findById(req.params.id, function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				console.log(req);
				item.comments.push(comment);
				item.save();
				console.log("new comment created");
				res.redirect("/Items/" + req.params.id);
			});
		}
	})
});

app.listen(8080, function(){
	console.log("Starting Server");
});