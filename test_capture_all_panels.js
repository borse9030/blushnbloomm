const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACT_DIR = 'C:\\Users\\bhave\\.gemini\\antigravity-ide\\brain\\f7e06e9f-18a5-47ee-a87c-4d929ece2c18';
const WORKSPACE_DIR = 'C:\\Users\\bhave\\OneDrive\\Desktop\\blushnbloomm';
const SCREENSHOT_DIR = path.join(WORKSPACE_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureAllPanels() {
  const tempDir = path.join(os.tmpdir(), 'chrome_ss_' + Date.now());
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1440,920',
    '--user-data-dir=' + tempDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    'http://localhost:3000'
  ]);

  console.log('Connecting to Chrome CDP...');
  await new Promise(r => setTimeout(r, 2400));

  const targets = await fetch('http://localhost:9222/json').then(r => r.json());
  const page = targets.find(t => t.type === 'page' && t.url.includes('localhost'));

  if (!page) {
    throw new Error('Could not find active website page target');
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => ws.onopen = resolve);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else if (msg.result && msg.result.exceptionDetails) {
            reject(new Error(JSON.stringify(msg.result.exceptionDetails)));
          } else {
            resolve(msg.result);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Desktop default
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  await send('Runtime.evaluate', {
    expression: `
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    `
  });

  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready',
    awaitPromise: true,
    returnByValue: true
  });

  // Wait for dynamic hydrate
  await new Promise(r => setTimeout(r, 2000));

  async function takeShot(filename) {
    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    const buffer = Buffer.from(data, 'base64');
    const localPath = path.join(SCREENSHOT_DIR, filename);
    const artifactPath = path.join(ARTIFACT_DIR, filename);

    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(artifactPath, buffer);
    console.log(`Saved ${filename}: ${(buffer.length / 1024).toFixed(1)} KB`);
  }

  // 1. HOME HERO (Panel 01)
  console.log('Capturing Panel 01: Home Hero...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo(0, 0);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const homeLink = document.querySelector('a[href="#home"]');
      if (homeLink) homeLink.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_01_home_hero.png');

  // 2. OUR COLLECTIONS (Panel 02)
  console.log('Capturing Panel 02: Our Collections...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('collections');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#collections"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_02_our_collections.png');

  // 3. FEATURED CREATIONS (Panel 03)
  console.log('Capturing Panel 03: Featured Creations...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('featured');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#featured"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_03_featured_creations.png');

  // 4. ABOUT (Panel 04)
  console.log('Capturing Panel 04: About Bloom&blush...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('about');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#about"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_04_about.png');

  // 5. OCCASIONS (Panel 05)
  console.log('Capturing Panel 05: Crafted for Every Occasion...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('occasions');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#occasions"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_05_occasions.png');

  // 6. PORTFOLIO (Panel 06)
  console.log('Capturing Panel 06: From Our Instagram Journal...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('portfolio');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#portfolio"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_06_portfolio.png');

  // 7. ACHIEVEMENTS (Panel 07)
  console.log('Capturing Panel 07: Studio Achievements & Highlights...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('achievements');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#achievements"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_07_achievements.png');

  // 8. CONTACT (Panel 08)
  console.log('Capturing Panel 08: Contact & Consultation Form...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('contact');
      el.scrollIntoView();
      window.scrollBy(0, -84);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const link = document.querySelector('a[href="#contact"]');
      if (link) link.classList.add('active');
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeShot('panel_08_contact.png');

  // 9. MOBILE VIEWPORT (Panel 09)
  console.log('Capturing Panel 09: Mobile Responsive Experience (iPhone 14 / 390px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo(0, 0);
    })()`
  });
  await new Promise(r => setTimeout(r, 800));
  await takeShot('panel_09_mobile_hero.png');

  // Mobile Collections
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('collections');
      el.scrollIntoView();
      window.scrollBy(0, -68);
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeShot('panel_09_mobile_collections.png');

  // Mobile Featured Creations
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('featured');
      el.scrollIntoView();
      window.scrollBy(0, -68);
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  await takeShot('panel_09_mobile_creations.png');

  console.log('Completed capturing all 9 panels!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

captureAllPanels().catch(e => {
  console.error('Capture error:', e);
  process.exit(1);
});
