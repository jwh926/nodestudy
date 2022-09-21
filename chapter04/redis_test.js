const redis = require('redis');
const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient({url: redisURL});
client.on('error', (err) => {
	console.log("Redis error: " + err);
});

client.rPush("key", "value");
client.get("key");
