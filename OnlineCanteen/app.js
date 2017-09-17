var express 		= require("express"),
	app				= express(),
	mongoose 		= require("mongoose"),
	bodyParser		= require("body-parser"),
	methodOverride	= require("method-override");
	
var	seedDB			= require("./seeds"),
	Items			= require("./models/item"),
	Comment 		= require("./models/comment"),
	Checkout 		= require("./models/checkout");

var categories = ["Soups", "Sandwiches", "Desserts"];
var checklist = [];

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/online_canteen", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

seedDB();

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


// SHOW - show individual
app.get("/Items/:id", function(req, res){
	Items.findById(req.params.id).populate("comments").exec(function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			console.log(item.comments);
			// res.render("foodItems/show", {item: item});
		}
	});
});

//==========================================================================================
//		CHECKOUT ROUTES
//==========================================================================================
app.post("/Items/:id/select", function(req, res){
	Checkout.findOne({name: "Bob Marley"}, function(err, checkout){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			checkout.list.push(req.params.id);
			checkout.save();
			// console.log(checklist);
		}		
	});	
	res.redirect("/Items");
});

app.get("/checkout", function(req, res){
	Checkout.findOne({name: "Bob Marley"}).populate("list").exec(function(err, checkout){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			// console.log(checkout);
			// console.log(checkout.list);
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