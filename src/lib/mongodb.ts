import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

let cached = global.mongoose as CachedConnection

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'main', // Force connection to main database
      // SSL/TLS configuration for production
      tls: true,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Retry settings
      retryWrites: true,
      retryReads: true,
      // Additional TLS options for Atlas
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB connection successful')
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection failed:', e)
    throw e
  }

  return cached.conn
}

export default connectToDatabase