import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[MysteryVerse Server] Listening on http://localhost:${PORT}`);
      console.log(`[MysteryVerse Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful Shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[MysteryVerse Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[MysteryVerse Server] Closed connections. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (error) {
    console.error('[MysteryVerse Server] Startup error:', error);
    process.exit(1);
  }
}

startServer();
