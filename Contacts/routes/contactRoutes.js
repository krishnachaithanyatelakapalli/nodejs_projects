var express = require('express'),
	router = express.Router({mergeParams: true}),
	bodyParser = require('body-parser');

var Contact	= require('../models/contact');

// INDEX - Landing Page
router.get('/', function(req, res){
	res.redirect('contacts');
});

// GET - View All
router.get('/contacts', function(req, res){
	Contact.find({}, function(err, contact){
		if(err){
			// Handle this error
			console.log(err);
		} else {			
			res.render('./contacts', {contact, contact});
		}
	});	
});

// SHOW - Show individual based on 'name'
router.get('/contacts/name/:tag', function(req, res){
	// console.log(req.params.tag);	
	Contact.find({name: new RegExp(req.params.tag,'i')}, function(err, contacts){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			// console.log(contacts);
			res.write(JSON.stringify(contacts));
			res.end();
		}
	});	
});

// SHOW - Show individual based on '_id'
router.get('/contacts/:id/id', function(req, res){
	Contact.findById(req.params.id, function(err, contact){
		if(err){
			// Handle this error
			console.log(err);
		} else {
			// console.log(contact);
			res.write(JSON.stringify(contact));
			res.end();
		}
	});
});

// NEW - Request to create new
router.get('/contacts/new', function(req, res){
	res.render('./new');
});

//CREATE - Create new 
router.post('/contacts', function(req, res){
	var newContact = {
		name: req.body.contacts.name,
		contact:{
			mobile: req.body.contacts.mobile,
			email: req.body.contacts.email
		},
		dob: req.body.contacts.dob
	};
	Contacts.create(newContact, function(err, contact){
		if(err){
			// Handle thid=s error
			console.log(err);
		} else {
			res.redirect('./contacts');
		}
	});
	res.redirect('/contacts');
});

// EDIT - Edit an existing contact
router.put('/contacts/:id/edit', function(req, res){
	// console.log(req.body);
	var newContact = {
		name: req.body.name,
		contact:{
			mobile: req.body.contact.mobile,
			email: req.body.contact.email
		},
		dob: req.body.dob
	};
	Contact.findByIdAndUpdate(req.params.id, newContact, function(err, contact){
		if(err){
			// Handle thid=s error
			console.log(err);
		} else {
			// console.log('updated contact');
			res.redirect('/contacts');
		}
	});
});

// DELETE - Delete a contact
router.delete('/contacts/:id/delete', function(req, res){
	Contact.findByIdAndRemove(req.params.id, function(err){
		if(err){
			// Handle this eror
			console.log(err);
		} else {
			// res.redirect('/contacts');
			// console.log('contact removed');
			res.end();
		}
	});
});

module.exports = router;