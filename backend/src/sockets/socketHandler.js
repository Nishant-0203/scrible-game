import roomManager from '../rooms/roomManager.js';
import { generateUserId } from '../utils/idGenerator.js';

/**
 * Socket event handler — Milestone 1: room management and chat only.
 */
export function handleSocketConnection(io, socket) {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.onAny((event, ...args) => {
    const payload = args[0] && typeof args[0] === 'object' ? JSON.stringify(args[0]) : args[0];
    console.log(`[Socket][IN] event="${event}" socket=${socket.id} payload=${payload}`);
  });

  // ============================================
  // Event: create_room
  // ============================================
  socket.on('create_room', async (payload, callback) => {
    try {
      const { roomId, username } = payload;

      if (!roomId || typeof roomId !== 'string') {
        const error = { success: false, error: 'Invalid room ID' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      if (await roomManager.roomExists(roomId)) {
        const error = { success: false, error: 'Room already exists' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      await roomManager.createRoom(roomId);

      if (username && typeof username === 'string' && username.trim().length > 0) {
        const userId = generateUserId();
        const player = { userId, username: username.trim(), socketId: socket.id, isConnected: true, score: 0 };
        await roomManager.joinRoom(roomId, player);
        await roomManager.setRoomHost(roomId, userId);
        socket.join(roomId);
        const players = await roomManager.getRoomPlayers(roomId);
        const response = { success: true, roomId, userId, username: player.username, message: 'Room created and joined' };
        socket.emit('room_created', response);
        io.to(roomId).emit('player_list_update', {
          roomId,
          hostId: userId,
          players: players.map(p => ({ userId: p.userId, username: p.username, isConnected: p.isConnected, score: p.score }))
        });
        if (callback) callback(response);
      } else {
        const response = { success: true, roomId, message: 'Room created successfully' };
        socket.emit('room_created', response);
        if (callback) callback(response);
      }

      console.log(`[Socket] Room ${roomId} created by ${socket.id}`);

    } catch (error) {
      console.error('[Socket] Error creating room:', error.message);
      const errorResponse = { success: false, error: error.message };
      socket.emit('room_error', errorResponse);
      if (callback) callback(errorResponse);
    }
  });

  // ============================================
  // Event: join_room
  // ============================================
  socket.on('join_room', async (payload, callback) => {
    try {
      const { roomId, username } = payload;

      if (!roomId || typeof roomId !== 'string') {
        const error = { success: false, error: 'Invalid room ID' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }
      if (!username || typeof username !== 'string' || username.trim().length === 0) {
        const error = { success: false, error: 'Invalid username' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      if (!(await roomManager.roomExists(roomId))) {
        const error = { success: false, error: 'Room does not exist' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      const userId = generateUserId();
      const player = { userId, username: username.trim(), socketId: socket.id, isConnected: true, score: 0 };

      await roomManager.joinRoom(roomId, player);
      socket.join(roomId);

      const [players, room] = await Promise.all([
        roomManager.getRoomPlayers(roomId),
        roomManager.getRoom(roomId)
      ]);

      const response = { success: true, roomId, userId, username: player.username, message: 'Joined room successfully' };
      socket.emit('room_joined', response);
      if (callback) callback(response);

      io.to(roomId).emit('player_list_update', {
        roomId,
        hostId: room ? room.hostId : '',
        players: players.map(p => ({ userId: p.userId, username: p.username, isConnected: p.isConnected, score: p.score }))
      });

      console.log(`[Socket] ${username} joined room ${roomId}`);

    } catch (error) {
      console.error('[Socket] Error joining room:', error.message);
      const errorResponse = { success: false, error: error.message };
      socket.emit('room_error', errorResponse);
      if (callback) callback(errorResponse);
    }
  });

  // ============================================
  // Event: send_message
  // ============================================
  socket.on('send_message', async (payload, callback) => {
    try {
      const { roomId, message } = payload;

      if (!roomId || typeof roomId !== 'string') {
        const error = { success: false, error: 'Invalid room ID' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }
      if (!message || typeof message !== 'string') {
        const error = { success: false, error: 'Invalid message' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      if (!(await roomManager.roomExists(roomId))) {
        const error = { success: false, error: 'Room does not exist' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      const playerInfo = await roomManager.getPlayerBySocketId(socket.id);
      if (!playerInfo) {
        const error = { success: false, error: 'Player not in any room' };
        socket.emit('room_error', error);
        if (callback) callback(error);
        return;
      }

      const room   = await roomManager.getRoom(roomId);
      const player = room.players.get(playerInfo.userId);

      io.to(roomId).emit('receive_message', {
        roomId,
        userId:    player.userId,
        username:  player.username,
        message:   message.trim(),
        timestamp: Date.now()
      });

      if (callback) callback({ success: true });

    } catch (error) {
      console.error('[Socket] Error sending message:', error.message);
      const errorResponse = { success: false, error: error.message };
      socket.emit('room_error', errorResponse);
      if (callback) callback(errorResponse);
    }
  });

  // ============================================
  // Event: disconnect
  // ============================================
  socket.on('disconnect', async (reason) => {
    console.log(`[Socket] Client disconnected: ${socket.id}, reason: ${reason}`);
    try {
      const disconnectInfo = await roomManager.removePlayerOnDisconnect(socket.id);

      if (disconnectInfo) {
        const { roomId, userId, username } = disconnectInfo;
        const room    = await roomManager.getRoom(roomId);
        const players = await roomManager.getRoomPlayers(roomId);

        socket.to(roomId).emit('player_disconnected', { roomId, userId, username, timestamp: Date.now() });
        io.to(roomId).emit('player_list_update', {
          roomId,
          hostId: room ? room.hostId : '',
          players: players.map(p => ({ userId: p.userId, username: p.username, isConnected: p.isConnected, score: p.score }))
        });

        console.log(`[Socket] Player ${username} removed from room ${roomId}`);
      }
    } catch (error) {
      console.error('[Socket] Error handling disconnect:', error.message);
    }
  });

  // ============================================
  // Event: error
  // ============================================
  socket.on('error', (error) => {
    console.error(`[Socket] Socket error on ${socket.id}:`, error);
  });
}