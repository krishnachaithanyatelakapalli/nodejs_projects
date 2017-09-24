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

var itemRoutes		= require("./routes/item"),
	commentRoutes	= require("./routes/comments"),
	checkoutRoute	= require("./routes/checkout");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/online_canteen", {useMongoClient: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use("/Items", itemRoutes);
app.use("/Items/:id/comment", commentRoutes);
app.use(checkoutRoute);

seedDB();

// HOME
app.get("/", function(req, res){
	res.render("home");
});

app.listen(8080, function(){
	console.log("Starting Server");
});