const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222'
    });
    console.log('Connected to Chrome');
    
    const pages = await browser.pages();
    console.log('Pages:', pages.length);
    
    if (pages.length > 0) {
      await pages[0].goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      console.log('Navigated to localhost:3000');
      
      await pages[0].screenshot({ path: '/workspace/test-screenshots/01_homepage.png' });
      console.log('Screenshot saved');
    }
    
    await browser.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
