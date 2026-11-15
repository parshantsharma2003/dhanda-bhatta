/**
 * Dhanda Bhatta Company - Secure Initial Admin Provisioning Script
 *
 * Provisions the initial Super Admin account safely on the server.
 * Public sign-up is disabled; this server script is the sanctioned method for initial onboarding.
 *
 * Usage:
 *   node scripts/create-admin.js --email="owner@dhandabhatta.com" --name="Bhatta Owner" --password="YourSecurePassword@2025"
 * Or define in .env.local:
 *   ADMIN_PROVISION_EMAIL=...
 *   ADMIN_PROVISION_NAME=...
 *   ADMIN_PROVISION_PASSWORD=...
 */

import dotenv from "dotenv";
import crypto from "crypto";
import * as argon2 from "@node-rs/argon2";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });
dotenv.config();

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      args[key] = value;
    }
  }
  return args;
}

function validatePasswordStrength(password) {
  if (!password || typeof password !== "string") {
    return "Password is required.";
  }
  if (password.length < 12) {
    return "Password must be at least 12 characters long.";
  }
  if (password.length > 128) {
    return "Password cannot exceed 128 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}

async function runProvisioning() {
  console.log("=================================================");
  console.log("  DHANDA BHATTA COMPANY - ADMIN PROVISIONING");
  console.log("=================================================");

  const args = parseArgs();
  const email = (args.email || process.env.ADMIN_PROVISION_EMAIL || "").toLowerCase().trim();
  const name = (args.name || process.env.ADMIN_PROVISION_NAME || "Super Admin").trim();
  const password = args.password || process.env.ADMIN_PROVISION_PASSWORD;
  const isForce = args.force === "true" || args.force === true;

  if (!email || !email.includes("@")) {
    console.error("❌ A valid email address is required via --email or ADMIN_PROVISION_EMAIL.");
    process.exit(1);
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    console.error(`❌ Password does not meet security requirements: ${passwordError}`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "dhanda_bhatta";

  if (!uri) {
    console.error("❌ MONGODB_URI is not configured in .env.local. Cannot persist admin credentials.");
    process.exit(1);
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(dbName);

  console.log(`Connected to database "${db.databaseName}".`);

  const usersCollection = db.collection("user");
  const accountsCollection = db.collection("account");

  // Check if an admin already exists to prevent duplicate owner accounts
  const existingAdmin = await usersCollection.findOne({ role: "admin" });
  if (existingAdmin && !isForce) {
    console.warn(`⚠️ An administrator account already exists: "${existingAdmin.email}".`);
    console.warn(`   To avoid accidental overwriting, provisioning was cancelled.`);
    console.warn(`   Pass --force=true if you explicitly intend to create an additional administrator.`);
    await client.close();
    process.exit(0);
  }

  // Check if user with this specific email already exists
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    console.error(`❌ A user with email "${email}" already exists. Aborting.`);
    await client.close();
    process.exit(1);
  }

  console.log("Hashing password using Argon2id (m=64MB, t=3, p=1)...");
  const hashedPassword = await argon2.hash(password, {
    algorithm: argon2.Algorithm.Argon2id,
    memoryCost: 65536,
    timeCost: 3,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const now = new Date();

  // 1. Insert user with 'admin' role and twoFactorEnabled: false
  // Mandatory 2FA: on first login, admin will be prompted to enroll TOTP
  await usersCollection.insertOne({
    id: userId,
    _id: userId,
    name,
    email,
    emailVerified: true,
    role: "admin",
    banned: false,
    twoFactorEnabled: false,
    createdAt: now,
    updatedAt: now,
  });

  // 2. Insert credential account
  await accountsCollection.insertOne({
    id: accountId,
    _id: accountId,
    userId,
    accountId: userId,
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`✅ Administrator successfully provisioned!`);
  console.log(`   User ID:            ${userId}`);
  console.log(`   Admin Email:        ${email}`);
  console.log(`   Role:               admin (Super Admin)`);
  console.log(`   Two-Factor Status:  Pending Enrollment (Required on first login)`);
  console.log(`   Password Algorithm: Argon2id`);
  console.log(`\nNext step: Log in at http://localhost:3000/admin/login and complete 2FA setup.\n`);

  await client.close();
}

runProvisioning().catch((err) => {
  console.error("❌ Provisioning failed:", err.message);
  process.exit(1);
});
