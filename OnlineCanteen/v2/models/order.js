var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({	
	name: String,
	quantity: Number,
	price: Number		
});

module.exports = mongoose.model("Orders", orderSchema);