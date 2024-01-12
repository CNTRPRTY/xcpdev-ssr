
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// TODO using snapshot for now
const DB_PATH = path.join(__dirname, '/v9611_b824787_counterparty.db');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

const app = express();
app.use(cors());
const port = 3000;

// returns an array
function queryDBRows(_db, sql, params_obj) {
	return new Promise(function (resolve, reject) {
		_db.all(sql, params_obj, function (err, rows) {
			if (err) return reject(err);
			else return resolve(rows);
		});
	});
}

app.get('/', async (req, res) => {
	const html = `
<!DOCTYPE html>
<html>
<body>

<h1>xcp.dev</h1>
<p>server side rendered proof of concept</p>

</body>
</html>
	`;

	res.set('Content-Type', 'text/html');
	res.status(200);
	res.send(Buffer.from(html.trim()));
});

app.get('/favicon.ico', async (req, res) => {
	res.sendFile(path.join(__dirname, '/favicon.ico'));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
