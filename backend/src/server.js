const path = require('node:path');
const express = require('express');
const http = require('node:http');
const cors = require('cors');
const { Server } = require('socket.io');

const env = require('./config/env');
const { initializeRedis } = require('./config/redis');
const { registerRoomHandlers } = require('./sockets/roomHandlers');
const { logInfo, logError } = require('./utils/logger');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.frontendUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initializeRedis();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Scribbl backend is running',
  });
});

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('/{*any}', (req, res, next) => {
  if (req.path.startsWith('/health') || req.path.startsWith('/socket.io')) {
    next();
    return;
  }

  res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
    if (error) {
      next();
    }
  });
});

io.on('connection', (socket) => {
  logInfo(`Socket connected: ${socket.id}`);
  registerRoomHandlers(io, socket);
});

server.listen(env.port, () => {
  logInfo(`Backend listening on port ${env.port}`);
  logInfo(`Allowed frontend origin: ${env.frontendUrl}`);
});

process.on('SIGINT', () => {
  logInfo('Shutting down server...');
  io.close();
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (error) => {
  logError('Unhandled rejection', error);
});
