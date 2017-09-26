var express 		= require('express'),
	app 			= express(),
	mongoose		= require('mongoose'),
	bodyParser		= require('body-parser'),
	methodOverride	= require('method-override');

var Contact			= require('./models/contact'),
	seedDB			= require('./seeds');

var contactRoutes	= require('./routes/contactRoutes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/contacts', {useMongoClient: true});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(contactRoutes);

seedDB();

app.listen(8080, function(){
	console.log('Started Server');
});