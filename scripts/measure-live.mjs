import https from 'https';

const routes = ['/', '/about', '/products', '/gallery', '/delivery', '/contact'];
const host = 'dhanda-bhatta.vercel.app';

async function measureRoute(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let ttfb = null;
    const req = https.get(`https://${host}${path}`, (res) => {
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
          vercelCache: res.headers['x-vercel-cache'],
          vercelId: res.headers['x-vercel-id'],
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
  console.log('Measuring live routes on https://' + host + '...');
  for (const r of routes) {
    const res = await measureRoute(r);
    console.log(JSON.stringify(res, null, 2));
  }
}

run();
