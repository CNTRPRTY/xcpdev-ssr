
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const port = 3000;

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
