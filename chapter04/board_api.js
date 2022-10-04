const morgan = require('morgan');
const url = require('url');
const uuidAPIKey = require('uuid-apikey');
const cors = require('cors');
const express = require('express');

const app = express();

app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const key = {
	apiKey: "QRQ7H2Q-TSFMVY6-Q29RXZY-4M35BBD",
	uuid: "be2e788a-d65f-4df8-b893-8eff250655ad"
};

let boardList = [];
let numOfBoard = 0;

app.get('/', (req, res) => {
	res.send(boardList);
});

app.get('/board', (req, res) => {
	res.send(boardList);
});

app.post('/board', (req, res)=>{
	const board = {
		"id": ++numOfBoard,
		"user_id": req.body.user_id,
		"date": new Date(),
		"title": req.body.title,
		"content": req.body.content,
	};
	boardList.push(board);

	res.redirect('/board');
});

app.put('/board/:id', (req, res) => {
	const findItem = boardList.find((item) => {
		return item.id == +req.params.id;
	});

	const idx = boardList.indexOf(findItem);
	boardList.splice(idx, 1);

	const board = {
		"id": +req.params.id,
		"user_id": req.params.user_id,
		"date": new Date(),
		"title": req.body.title,
		"content": req.body.content,
	};
	boardList.push(board);

	res.redirect('/board');
});

app.delete('/board/:id', (req, res) => {
	const findItem = boardList.find((item) => {
		return item.id == +req.params.id;
	});
	const idx = boardList.indexOf(findItem);
	boardList.splice(idx, 1);

	res.redirect('/board');
});

app.get('/board/:apikey/:type', (req, res) => {
	let {type, apikey} = req.params;
	const queryData = url.parse(req.url, true).query;

	if(uuidAPIKey.isAPIKey(apikey) && uuidAPIKey.check(apikey, key.uuid)) {
		if(type === 'search') {
			const keyword = queryData.keyword;
			const result = boardList.filter((e) => {
				return e.title.includes(keyword);
			});
			res.send(result);
		} else if(type === 'user') {
			const user_id = queryData.user_id;
			const result = boardList.filter((e) => {
				return e.user_id === user_id;
			});
			res.send(result);
		} else {
			res.send('Wrong URL');
		}
	} else {
		res.send('Wrong API key');
	}
});

app.listen(app.get('port'), () => {
	console.log("http://localhost:8080");
});
