import "server-only";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

/**
 * Global cache across Next.js Hot Module Replacement (HMR) in development.
 * Prevents exhausting connection pool limits during hot reloads.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let sharedClient = global.__sharedMongoClient;

const DEFAULT_DB_NAME = "dhanda_bhatta";

/**
 * Redacts credentials from MongoDB URIs for safe diagnostic logging.
 * Never outputs raw passwords or host credentials.
 */
export function redactMongoUri(uri) {
  if (!uri || typeof uri !== "string") return "[NOT_SET]";
  try {
    return uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/i, "$1***:***@");
  } catch {
    return "[REDACTED_URI]";
  }
}

/**
 * Returns a shared singleton MongoClient instance for Better Auth and raw driver operations.
 * Manages connection pooling tightly (maxPoolSize: 10).
 */
export function getSharedMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) return null;

  if (!sharedClient) {
    sharedClient = global.__sharedMongoClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  return sharedClient;
}

/**
 * Returns the MongoDB Db instance from the shared MongoClient.
 */
export function getSharedMongoDb() {
  const client = getSharedMongoClient();
  if (!client) return null;
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  return client.db(dbName);
}

/**
 * Centralized MongoDB Atlas Mongoose connection manager.
 * Connects to the configured database with strict connection pooling and fail-fast timeouts.
 */
export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;

  if (!uri || uri.trim() === "") {
    const error = new Error(
      "MONGODB_URI environment variable is not defined. Database operations are unavailable."
    );
    error.code = "MONGODB_URI_MISSING";
    throw error;
  }

  // If already connected and ready, return existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, await the existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== "production", // auto-index in dev only
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        const actualDb = m.connection.db?.databaseName;
        if (actualDb && actualDb !== dbName) {
          console.warn(
            `[MongoDB] Connected database is "${actualDb}", but configured target is "${dbName}". Verifying namespace.`
          );
        }
        return m;
      })
      .catch((err) => {
        // Reset cached promise so subsequent requests can retry
        cached.promise = null;
        console.error(
          `[MongoDB] Connection error (${redactMongoUri(uri)}): ${err.message}`
        );
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
}

/**
 * Returns safe connection status for health checks and status diagnostics.
 * Never exposes raw credentials or sensitive details.
 */
export function getDatabaseStatus() {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const readyState = mongoose.connection.readyState;
  const isConnected = readyState === 1;
  const dbName = isConnected ? mongoose.connection.db?.databaseName || null : null;

  return {
    isConnected,
    state: stateMap[readyState] || "unknown",
    readyState,
    databaseName: dbName,
    hasUriConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim()),
    targetDatabaseName: process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME,
  };
}

/**
 * Safely disconnects the database connections (for test teardowns).
 */
export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (sharedClient) {
    await sharedClient.close();
    sharedClient = null;
    global.__sharedMongoClient = null;
  }
  cached.conn = null;
  cached.promise = null;
}

export default connectToDatabase;
