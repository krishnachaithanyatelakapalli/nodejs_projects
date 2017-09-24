//==========================================================================================
//		COMMENTS ROUTES
//==========================================================================================

var express = require("express"),
	router = express.Router({mergeParams: true}),
	Items = require("../models/item"),
	Comment = require("../models/comment");

router.get("/new", function(req, res){
	Items.findById(req.params.id, function(err, item){
		if(err){
			//Handle this error
			console.log(err);
		} else {
			res.render("comments/new", {item: item});
		}
	});
});

router.post("/", function(req, res){
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

module.exports = router;