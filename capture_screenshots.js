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

async function capture() {
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

  console.log('Starting headless Chrome session...');
  await new Promise(r => setTimeout(r, 2200));

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

  // Set 2x Retina scale factor (2880x1800 rendered) for magazine-grade ultra-sharp quality
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Enable auto scroll behavior so scrolling is instantaneous
  await send('Runtime.evaluate', {
    expression: `
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    `
  });

  // Wait for fonts & DOM ready
  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready',
    awaitPromise: true,
    returnByValue: true
  });

  // Wait for dynamic products and achievements to hydrate
  await new Promise(r => setTimeout(r, 3500));

  async function takeViewportScreenshot(filename) {
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

  // 1. HERO SHOWCASE
  console.log('Capturing Screenshot 1: Hero Showcase...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo(0, 0);
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const homeLink = document.querySelector('a[href="#home"]');
      if (homeLink) homeLink.classList.add('active');
      const hdr = document.querySelector("#main-header");
      if (hdr) hdr.classList.remove("scrolled");
    })()`
  });
  await new Promise(r => setTimeout(r, 700));
  await takeViewportScreenshot('01_hero_showcase.png');

  // 2. CURATED COLLECTIONS
  console.log('Capturing Screenshot 2: Curated Collections...');
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
  await takeViewportScreenshot('02_curated_collections.png');

  // 3. FEATURED CREATIONS
  console.log('Capturing Screenshot 3: Featured Creations Catalog...');
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
  await takeViewportScreenshot('03_featured_creations.png');

  // 4. STUDIO ACHIEVEMENTS & MILESTONES
  console.log('Capturing Screenshot 4: Studio Achievements & Highlights...');
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
  await new Promise(r => setTimeout(r, 800));
  await takeViewportScreenshot('04_studio_achievements.png');

  // 5. ARTISANAL STORY & CONSULTATION
  console.log('Capturing Screenshot 5: Artisanal Story & WhatsApp Consultation...');
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
  await takeViewportScreenshot('05_story_and_consultation.png');

  // BONUS 6: OWNER STUDIO PORTAL
  console.log('Capturing Screenshot 6: Owner Studio Portal...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/' });
  await new Promise(r => setTimeout(r, 2200));
  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready',
    awaitPromise: true,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 1200));
  await takeViewportScreenshot('06_owner_studio_portal.png');

  console.log('All 6 professional screenshots successfully created!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
