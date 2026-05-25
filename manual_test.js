const http = require('http');
const WebSocket = require('ws').WebSocket;
const fs = require('fs');

async function sendCDPCommand(pageId, method, params) {
  return new Promise((resolve, reject) => {
    const wsUrl = 'ws://localhost:9222/devtools/page/' + pageId;
    const socket = new WebSocket(wsUrl);
    
    let response = null;
    
    socket.on('open', () => {
      socket.send(JSON.stringify({ id: Date.now(), method: method, params: params || {} }));
    });
    
    socket.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id) {
        response = msg.result;
        socket.close();
      }
    });
    
    socket.on('error', reject);
    socket.on('close', () => {
      if (response) resolve(response);
      else reject(new Error('No response'));
    });
    
    setTimeout(() => {
      socket.close();
      reject(new Error('Timeout'));
    }, 10000);
  });
}

async function main() {
  // 获取页面列表
  const pagesReq = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
  
  console.log('Available pages:', pagesReq.length);
  
  // 创建新页面
  const newPage = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 9222,
      path: '/json/new',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write('{"url":"http://localhost:3000/"}');
    req.end();
  });
  
  console.log('Created page:', newPage.id);
  
  // 等待页面加载
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 截图
  const screenshot = await sendCDPCommand(newPage.id, 'Page.captureScreenshot', {});
  fs.writeFileSync('/workspace/test-screenshots/01_homepage.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Screenshot saved to /workspace/test-screenshots/01_homepage.png');
}

main().catch(console.error);
