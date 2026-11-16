import dns from 'dns/promises';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkMongoHost() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI found.');
    return;
  }
  // Extract host only: mongodb+srv://user:pass@host/db
  const hostMatch = uri.match(/@([^/?]+)/);
  if (!hostMatch) {
    console.log('Could not parse host from MONGODB_URI');
    return;
  }
  const host = hostMatch[1];
  console.log('MongoDB Host:', host);

  try {
    // Resolve SRV or A records
    if (uri.startsWith('mongodb+srv://')) {
      const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${host}`);
      console.log('MongoDB SRV Records count:', srvRecords.length);
      for (const r of srvRecords) {
        const ips = await dns.resolve4(r.name).catch(() => []);
        console.log(`SRV Target: ${r.name} -> IPs: ${ips.join(', ')}`);
      }
    } else {
      const ips = await dns.resolve4(host);
      console.log('Host IPs:', ips);
    }
  } catch (err) {
    console.log('DNS Resolution info:', err.message);
  }
}

checkMongoHost();
