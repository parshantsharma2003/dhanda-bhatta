import http from 'http';

const routes = ['/', '/about', '/products', '/gallery', '/delivery', '/contact', '/products/first-class-red-bricks'];
const host = 'localhost';
const port = 3000;

async function measureRoute(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let ttfb = null;
    const req = http.get({ host, port, path }, (res) => {
      ttfb = Date.now() - startTime;
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const totalTime = Date.now() - startTime;
        resolve({
          path,
          statusCode: res.statusCode,
          ttfb,
          totalTime,
          sizeBytes: Buffer.byteLength(data),
          cacheControl: res.headers['cache-control'],
          contentType: res.headers['content-type'],
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log(`Measuring local production server (http://${host}:${port})...`);
  for (const r of routes) {
    const res = await measureRoute(r);
    console.log(JSON.stringify(res, null, 2));
  }
}

run();
