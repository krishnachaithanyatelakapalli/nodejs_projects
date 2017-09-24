var express = require("express"),
	router = express.Router({mergeParams: true}),
	Items = require("../models/item");

var categories = ["Soups", "Sandwiches", "Desserts"];

// INDEX - Get all
router.get("/", function(req, res){
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
router.get("/new", function(req, res){
	res.render("manager/addNew");
});

router.post("/Items/new", function(req, res){
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
router.get("/:id/edit", function(req, res){
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
router.put("/:id/edit", function(req, res){
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
router.delete("/:id/delete", function(req, res){
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
router.get("/:id", function(req, res){
	Items.findById(req.params.id).populate("comments").exec(function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			// console.log(item.comments);
			res.render("foodItems/show", {item: item});
		}
	});
});

module.exports = router;