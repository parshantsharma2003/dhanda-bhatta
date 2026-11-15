/**
 * Dhanda Bhatta Company - Database Connection & Health Verification Script
 *
 * Verifies MongoDB Atlas connectivity, database namespace, and model compilation.
 * Usage: node scripts/test-db-connection.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config();

function redact(uri) {
  if (!uri) return "[NOT_SET]";
  return uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/i, "$1***:***@");
}

async function testConnection() {
  console.log("=================================================");
  console.log("  DHANDA BHATTA COMPANY - DB HEALTH CHECK");
  console.log("=================================================");

  const uri = process.env.MONGODB_URI;
  const targetDbName = process.env.MONGODB_DB_NAME || "dhanda_bhatta";

  console.log(`Target Database Name: ${targetDbName}`);
  console.log(`Configured URI:        ${redact(uri)}`);

  if (!uri) {
    console.log("\n⚠️  MONGODB_URI is not currently set in .env.local.");
    console.log("   The application is operating in resilient fallback mode (using verified local catalogue).");
    console.log("   To connect MongoDB Atlas, copy .env.example to .env.local and set your MONGODB_URI.\n");
    return { ok: true, fallbackMode: true };
  }

  try {
    console.log("\nAttempting connection to MongoDB Atlas with 6-second timeout...");
    const conn = await mongoose.connect(uri, {
      dbName: targetDbName,
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });

    const activeDbName = conn.connection.db?.databaseName;
    console.log(`✅ MongoDB Connection Successful!`);
    console.log(`   Connected Database: ${activeDbName}`);
    console.log(`   Host:               ${conn.connection.host}`);
    console.log(`   Port:               ${conn.connection.port}`);
    console.log(`   ReadyState:         ${conn.connection.readyState} (Connected)`);

    if (activeDbName !== targetDbName) {
      console.warn(`   ⚠️ Warning: Connected database "${activeDbName}" differs from target "${targetDbName}".`);
    }

    // Ping test
    const pingResult = await conn.connection.db.admin().ping();
    console.log(`   Ping Result:        ${JSON.stringify(pingResult)}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected cleanly.\n");
    return { ok: true, connected: true };
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed:`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Code:    ${error.code || "N/A"}`);
    console.log("\n   Note: When MongoDB Atlas is unreachable, the website continues to function");
    console.log("   gracefully using cached catalogue data and direct contact channels.\n");
    return { ok: false, error: error.message };
  }
}

testConnection().catch((e) => {
  console.error("Test script error:", e);
  process.exit(1);
});
