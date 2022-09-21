const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname, "./.env")});
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
	let numOfRows = "1";
	let pageNo = "1";
	let dataTerm = "DAILY";
	let ver = "1.3";
	let stationName = "구로구";
	let returnType = "json";

	let params = encodeURI("serviceKey") + "=" + serviceKey;
	params += "&" + encodeURI("numOfRows") + "=" + encodeURI(numOfRows);
	params += "&" + encodeURI("pageNo") + "=" + encodeURI(pageNo);
	params += "&" + encodeURI("dataTerm") + "=" + encodeURI(dataTerm);
	params += "&" + encodeURI("ver") + "=" + encodeURI(ver);
	params += "&" + encodeURI("stationName") + "=" + encodeURI(stationName);
	params += "&" + encodeURI("returnType") + "=" + encodeURI(returnType);

	const url = airUrl + params;

	try {
		const result = await axios.get(url);
		const airItem = {
			// "location": result.data.ArpltnInforInqireSvcVo["stationName"],
			"location": stationName,
			"time": result.data.response.body.items[0]["dataTime"],
			"pm10": result.data.response.body.items[0]["pm10Value"],
			"pm25": result.data.response.body.items[0]["pm25Value"],
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

		res.send(`location: ${airItem.location}, time: ${airItem.time}<br>
		미세먼지: ${badAir[0]}(${airItem.pm10}), 초미세먼지: ${badAir[1]}(${airItem.pm25})`);
	} catch (error) {
		console.log(error);
	}
});

app.listen(app.get('port'), () => {
	console.log("http://localhost:" + app.get('port'));
});
