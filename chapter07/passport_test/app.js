const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const Localstrategy = require("passport-local").Strategy;
const app = express();
const port = 8080;

app.set("port", process.env.PORT || port);

let fakeUser = {
	username: "test@test.com",
	password: "test@1234",
};

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("passportExample"));
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: "passportExample",
		cookie: {
			httpOnly: true,
			secure: false,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	console.log("seriallizeUser", user);
	done(null, fakeUser);
});

passport.deserializeUser((id, done) => {
	console.log("deserializeUser", id);
	done(null, fakeUser);
});

passport.use(
	new Localstrategy((username, password, done) => {
		if (username === fakeUser.username) {
			if (password === fakeUser.password) {
				return done(null, fakeUser);
			} else {
				return done(null, false, { message: "password incorrect" });
			}
		} else {
			return done(null, false, { message: "username incorrect" });
		}
	})
);

app.get("/", (req, res) => {
	if (!req.user) {
		res.sendFile(__dirname + "/index.html");
	} else {
		const user = req.user.username;
		const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<body>
			<p>${user}님 안녕하세요!</p>
			<button onclick="location.href='/logout'">Logout</button>
		</body>
		</html>
		`;
		res.send(html);
	}
});

app.post(
	"/login",
	passport.authenticate("local", { failureRedirect: "/" }),
	(req, res) => {
		res.send("Login success");
	}
);

app.get("/logout", (req, res) => {
	req.logout(() => {
		res.redirect("/");
	});
});

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} does not exist`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = err;
	res.status(err.status || 500);
	console.error(err);
	res.send("error occurred");
});

app.listen(app.get("port"), () => {
	console.log(`listening on ${app.get("port")}`);
});
