const morgan = require("morgan");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const path = require('path');
const http = require("http");
const app = express();

const webSocket = require("./socket.js");

app.set("port", process.env.PORT || 8080);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: "dorazi",
		cookie: {
			httpOnly: true,
			secure: false,
		},
	})
);

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "/index.html"));
});

// 404 error
app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} router is not found.`);
	error.status = 404;
	next(error);
});

// 500 error
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
	res.status(err.status || 500);
	res.send(err.message);
});

const server = app.listen(app.get("port"), () => {
	console.log(app.get("port"), "port is ready");
});

webSocket(server, app, session);
