import { MongoClient } from 'mongodb';

// This is the ONLY place the app connects to MongoDB. Every service file calls getDb() to get the already-open database handle rather than creating its own connection.

let client;
let db;

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGO_DB_NAME || 'doodlr';

  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    db = client.db(dbName);
    console.log(`MongoDB connected: ${dbName}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected yet — connectDB() must run before getDb() is called.');
  }
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}
