const socketIO = require('socket.io');

module.exports = (server) => {
	const io = socketIO(server, {path: "/socket.io"});
	io.on("connection", (socket) => {
		const req = socket.request;
		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		console.log(`New client: ${ip}, socket.id: ${socket.id}`);
		socket.on("disconnect", () => {
			console.log(`Client out: ${ip}, socket.id: ${socket.id}`);
			clearInterval(socket.interval);
		});

		socket.on("error", (error) => {
			console.error(error);
		});

		socket.on("from client", (data) => {
			console.log(data);
		});

		socket.interval = setInterval(() => {
			socket.emit("from server", "message");
		}, 3000);
	})
}