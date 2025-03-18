const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Puppeteer JSON Fetch</title></head>
        <body>
            <h2>Fetch JSON Using Real Browser (403 Bypass)</h2>
            <form action="/fetch" method="post">
                <label>Enter URL: <input type="url" name="url" required></label><br><br>
                <button type="submit">Fetch JSON</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/fetch', async (req, res) => {
    const { url } = req.body;

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.goto(url, { waitUntil: 'networkidle2' });

        const bodyText = await page.evaluate(() => document.querySelector('body').innerText);
        
        await browser.close();

        // Try parsing as JSON
        let json;
        try {
            json = JSON.parse(bodyText);
        } catch (e) {
            return res.send(`<pre>Could not parse response as JSON.</pre><br><a href="/">Back</a>`);
        }

        res.send(`<h3>Fetched Response:</h3><pre>${JSON.stringify(json, null, 2)}</pre><br><a href="/">Back</a>`);
    } catch (error) {
        res.send(`<pre>Error: ${error.message}</pre><br><a href="/">Back</a>`);
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
