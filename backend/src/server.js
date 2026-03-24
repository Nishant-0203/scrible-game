import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeSocket } from './config/socket.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Configuration
const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.static(PUBLIC_DIR)); // Serves D:\Scribble\public regardless of cwd

// ============================================
// REST API Endpoints (Optional - for testing)
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Express] Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Initialize Socket.IO
// ============================================

const io = initializeSocket(httpServer);

// ============================================
// Start Server
// ============================================

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ============================================
// Graceful Shutdown
// ============================================

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, closing server gracefully...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Server] SIGINT received, closing server gracefully...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});