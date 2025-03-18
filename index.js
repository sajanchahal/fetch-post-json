const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h2>Fetch JSON Using Headless Browser (403 bypass)</h2>
        <form action="/fetch" method="post">
            <label>Enter URL: <input type="url" name="url" required></label><br><br>
            <button type="submit">Fetch JSON</button>
        </form>
    `);
});

app.post('/fetch', async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: executablePath(), // find local chromium
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.goto(url, { waitUntil: 'networkidle2' });

        const bodyText = await page.evaluate(() => document.body.innerText);
        await browser.close();

        try {
            const json = JSON.parse(bodyText);
            res.send(`<h3>Response:</h3><pre>${JSON.stringify(json, null, 2)}</pre><a href="/">Back</a>`);
        } catch {
            res.send(`<pre>Not JSON response:</pre><br><pre>${bodyText}</pre><a href="/">Back</a>`);
        }
    } catch (error) {
        res.send(`<pre>Error: ${error.message}</pre><a href="/">Back</a>`);
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
