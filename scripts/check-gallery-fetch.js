async function run() {
  const res = await fetch('http://localhost:3000/gallery');
  const html = await res.text();
  const regex = /<img[^>]+src="([^">]+)"/g;
  let match;
  const urls = [];
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  console.log('Images rendered on /gallery:');
  urls.forEach(u => console.log(' - ' + decodeURIComponent(u)));
}

run().catch(console.error);
