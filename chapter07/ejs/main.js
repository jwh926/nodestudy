const express = require("express");
const app = express();

app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
	res.render("main", { menu: "Home" });
});

app.get("/menu1", (req, res, next) => {
	res.render("main", { menu: "Menu1" });
});

app.get("/menu2", (req, res, next) => {
	res.render("main", { menu: "Menu2" });
});

app.get("/menu3", (req, res, next) => {
	res.render("main", { menu: "Menu3" });
});

app.listen(app.get("port"), () => {
	console.log(`http://localhost:${app.get("port")}`);
});
