const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async (event) => {
  let browser = null;
  const url = (event && event.url) || 'https://example.com';

  try {
    const execPath = (await chromium.executablePath) || '/usr/bin/chromium-browser';
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: execPath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(event.ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // ページのタイトルを返す簡単な処理
    const title = await page.title();
    return { statusCode: 200, body: `Title: ${title}` };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: String(err) };
  } finally {
    if (browser) await browser.close();
  }
};