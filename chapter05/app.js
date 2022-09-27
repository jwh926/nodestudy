const morgan = require('morgan');
const models = require('./models');
const express = require('express')
const app = express()

app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res, next) => {
	models.newCustomer.findAll().then((customers) => {
		res.send(customers);
	}).catch((err) => {
		console.error(err);
		next(err);
	});
});

app.get('/customer', (req, res) => {
	res.sendFile(__dirname + '/customer.html');
});

app.post('/customer', (req, res) => {
	let body = req.body;

	models.newCustomer.create({
		name: body.name,
		age: body.age,
		sex: body.sex
	}).then(result => {
		console.log('customer created!');
		res.redirect('/customer');
	}).catch(err => {
		console.log(err);
	});
});

app.listen(app.get('port'), () => console.log(`http://localhost:${app.get('port')}`));
