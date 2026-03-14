import mongoose, { type Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

/**
 * Cached connection stored on the Node.js global object so it
 * survives hot-reloads in development without opening new connections.
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cache;
}

async function connectToDatabase(): Promise<Connection> {
  // Return the existing connection if already established
  if (cache.conn) {
    return cache.conn;
  }

  // Reuse the in-flight connection promise to avoid race conditions
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI as string, { bufferCommands: false })
      .then((m) => m.connection);
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null; // Reset promise on failure
    throw error;
  }

  return cache.conn;
}

export default connectToDatabase;
