const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

app.set("port", process.env.PORT || 8080);

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(cookieParser("secret@1234"));
app.use(
	session({
		secret: "secret@1234",
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
		},
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	if (req.session.name) {
		const output = `
			<h2>logged in user</h2>
			<p>welcome ${req.session.name}</p>
		`;
		res.send(output);
	} else {
		const output = `
			<h2>not logged in</h2>
			<p>please log in</p>
		`;
		res.send(output);
	}
});

app.get("/login", (req, res) => {
	console.log(req.session);
	req.session.name = "DDatG";
	res.end("Login OK");
});

app.get("/logout", (req, res) => {
	res.clearCookie("connect.sid");
	res.end("Logout OK");
});

app.listen(app.get("port"), () => {
	console.log("listening on", app.get('port'));
});
