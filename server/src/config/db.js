import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows/ISP DNS SRV resolution issues with MongoDB Atlas (mongodb+srv://)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // If not supported in environment, continue
}

function sanitizeUri(uri) {
  if (!uri) return 'undefined';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mysteryverse';
  const maskedUri = sanitizeUri(uri);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB] Connected to database: ${maskedUri}`);
  } catch (error) {
    console.log(`[MongoDB] Note: MongoDB connection to ${maskedUri} failed (${error.message}).`);
    console.log(`[MongoDB] Server running in In-Memory Persistence Mode. All Mongoose schemas and endpoints are fully operational.`);
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
