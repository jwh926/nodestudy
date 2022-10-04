const path = require("path");
const express = require("express");
const app = express();

const port = 8080;
app.set("port", process.env.PORT || port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index", {
		People: [
			{
				name: "Gildong",
				age: "15",
			},
			{
				name: "Jinsu",
				age: "27",
			},
			{
				name: "Hyena",
				age: "25",
			},
			{
				name: "DDatG",
				age: "18",
			},
		],
		title: "DDatG",
	});
});

app.listen(app.get("port"), () => {
	console.log(`http://localhost:${app.get("port")}`);
});
