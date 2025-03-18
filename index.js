const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// HTML form route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Fetch JSON 403 Bypass</title></head>
        <body>
            <h2>Fetch JSON Data (403 Bypass)</h2>
            <form action="/fetch" method="post">
                <label>Enter URL: <input type="url" name="url" required></label><br><br>
                <label>Method:
                    <select name="method">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                    </select>
                </label><br><br>
                <button type="submit">Fetch JSON</button>
            </form>
        </body>
        </html>
    `);
});

// Fetch JSON route
app.post('/fetch', async (req, res) => {
    const { url, method } = req.body;

    try {
        const response = await axios({
            method: method.toLowerCase(),
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/plain, */*',
                'Referer': url,
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive'
            }
        });

        res.send(`<h3>Response:</h3><pre>${JSON.stringify(response.data, null, 2)}</pre><br><a href="/">Back</a>`);
    } catch (err) {
        res.send(`<pre>Error: ${err.response ? 'HTTP ' + err.response.status : err.message}</pre><br><a href="/">Back</a>`);
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
