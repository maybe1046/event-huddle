# MongoDB Connection (`lib/mongodb.ts`)

## Overview

Establishes and caches a Mongoose connection to MongoDB, designed for Next.js where API routes are serverless functions that may spin up independently.

## Key Concepts

### Environment Variable

The connection string is read from `MONGODB_URI`. The module throws immediately at import time if the variable is missing, ensuring a fast failure rather than a silent runtime error.

### Connection Caching

Next.js in development mode clears the Node.js module cache on every request (hot-reload). Without caching, each reload would open a new database connection, quickly exhausting the connection pool.

The solution stores the connection on `globalThis` — the one object that survives module re-evaluation:

```ts
declare global {
  var mongooseCache: MongooseCache | undefined;
}
```

### Race Condition Prevention

The cache holds both the resolved `conn` and the in-flight `promise`. If multiple requests call `connectToDatabase()` concurrently before the first connection resolves, they all await the same promise instead of opening parallel connections.

### `bufferCommands: false`

Disables Mongoose's default command buffering. Without a valid connection, operations will fail immediately instead of queuing silently — making connection issues visible right away.

## Usage

```ts
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  // ... use Mongoose models
}
```
