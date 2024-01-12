
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.get('/', async (req, res) => {
	res.status(200).json({
		wip: true,
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
