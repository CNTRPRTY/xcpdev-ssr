
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
const port = 3000;

async function libApiRequestSql(sql) {
	const lib_response = await libApiRequest('sql', { query: sql });
	return lib_response.result; // rows
}
// counterparty-lib api proxy
async function libApiRequest(method, params = null) {
    const url = `http://counterparty:4000/api/`; // trailing slash required!
    const username = 'rpc';
    const password = 'rpc';
    const options = {
        "method": "POST",
        "headers": {
            "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
        }
    };
    const body = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": method
    };
    if (params) {
        body.params = params;
    }
    options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorTextPre = await response.text(); // can come empty
        const errorText = errorTextPre.trim().length === 0 ? '' : ` ${errorTextPre}`; // add space if not empty
        throw Error(`[${response.status}:${response.statusText}]${errorText}`);
    }
    const data = await response.json();

    return data;
}

app.get('/', async (req, res) => {

	// get latest blocks example
	const sql = `
		SELECT *
		FROM blocks
		WHERE block_index
		ORDER BY block_index DESC
		LIMIT 5;
	`;
	const lib_response_rows = await libApiRequestSql(sql);

	const rowsAsBlockListElements = lib_response_rows.map(row => {
		const ihtml = `
<li>
	<strong>${row.block_index}</strong>
	<ul>
		<li>L: ${row.ledger_hash}</li>
		<li>TX: ${row.txlist_hash}</li>
		<li>M: ${row.messages_hash}</li>
	</ul>
</li>
		`;
		return ihtml.trim();
	});

	const html = `
<!DOCTYPE html>
<html>
<body>

<h1>xcp.dev</h1>
<p>server side rendered proof of concept</p>

<h2>Latest blocks:</h2>
<ul>${rowsAsBlockListElements.join('')}</ul>

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
