const mongoose = require("mongoose");

mongoose
	.connect("mongodb://127.0.0.1:27017/roadbook", {
		useNewUrlParser: true
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

const customerSchema = mongoose.Schema(
	{
		name: "string",
		age: "number",
		sex: "string",
	},
	{
		collection: "newCustomer",
	}
);

const Customer = mongoose.model('Schema', customerSchema);

// const customer1 = new Customer({name: '홍길동', age: 30, sex: '남'});

// customer1.save().then(() => {
// 	console.log(customer1);
// }).catch((err) => {
// 	console.log('Error: ' + err);
// });

Customer.find((err, customer) => {
	console.log('READ: Model.find()');
	if(err) {
		console.log(err);
	} else {
		console.log(customer);
	}
});

Customer.findById({ _id: "63329e02f223980cfc08f39f" }, (err, customer) => {
	console.log("UPDATE: Model.findById");
	if (err) {
		console.log(err);
	} else {
		customer.name = "modified";
		customer.save((err, modified_customer) => {
			if (err) {
				console.log(err);
			} else {
				console.log(modified_customer);
			}
		});
	}
});
