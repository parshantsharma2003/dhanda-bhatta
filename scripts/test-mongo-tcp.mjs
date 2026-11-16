import net from 'net';

function measureTcp(host, port = 27017) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(5000);
    socket.connect(port, host, () => {
      const ms = Date.now() - start;
      socket.destroy();
      resolve({ host, port, ms, status: 'CONNECTED' });
    });
    socket.on('error', (err) => {
      resolve({ host, port, error: err.message, status: 'ERROR' });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ host, port, status: 'TIMEOUT' });
    });
  });
}

async function test() {
  const hosts = [
    'ac-ihmqokk-shard-00-00.frrt8yd.mongodb.net',
    'ac-ihmqokk-shard-00-01.frrt8yd.mongodb.net',
    'ac-ihmqokk-shard-00-02.frrt8yd.mongodb.net',
  ];
  for (const h of hosts) {
    const res = await measureTcp(h);
    console.log(res);
  }
}

test();
