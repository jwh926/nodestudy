const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, "../../.env")});
const morgan = require("morgan");
const express = require("express");
const axios = require("axios");
const app = express();

app.set("port", process.env.PORT || 8080);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/airkorea/", async (req, res) => {
	const serviceKey = process.env.airServiceKey;
	const airUrl =
		"http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";
	let params = encodeURI("serviceKey") + "=" + serviceKey;
	params += "&" + encodeURI("numOfRows") + "=" + encodeURI("1");
	params += "&" + encodeURI("pageNo") + "=" + encodeURI("1");
	params += "&" + encodeURI("dataTerm") + "=" + encodeURI("DAILY");
	params += "&" + encodeURI("ver") + "=" + encodeURI("1.3");
	params += "&" + encodeURI("stationName") + "=" + encodeURI("마포구");
	params += "&" + encodeURI("returnType") + "=" + encodeURI("json");

	const url = airUrl + params;

	try {
		const result = await axios.get(url);
		console.log(result);
		const airItem = {
			"location": result.data.ArpltnInforInqireSvcVo["stationName"],
			"time": result.data.list[0]["dataTime"],
			"pm10": result.data.list[0]["pm10Value"],
			"pm25": result.data.list[0]["pm25Value"],
		};
		const badAir = [];

		if (airItem.pm10 <= 30) {
			badAir.push("good");
		} else if (airItem.pm10 > 30 && airItem.pm10 <= 80) {
			badAir.push("normal");
		} else {
			badAir.push("bad");
		}

		if (airItem.pm25 <= 15) {
			badAir.push("good");
		} else if (airItem.pm25 > 15 && airItem.pm25 <= 35) {
			badAir.push("normal");
		} else {
			badAir.push("bad");
		}

		res.send("location: ${airItem.location}, time: ${airItem.time}<br> 미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]}");
	} catch (error) {
		console.log(error);
	}
});

app.listen(app.get('port'), () => {
	console.log("http://localhost:" + app.get('port'));
});