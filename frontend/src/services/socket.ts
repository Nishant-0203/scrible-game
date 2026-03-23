import { io } from 'socket.io-client';
import type { LobbyRoom } from '../types/sockets';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const socket = io(socketUrl, {
  autoConnect: true,
  transports: ['websocket'],
});

export type AckResponse = {
  ok: boolean;
  message?: string;
  room?: LobbyRoom;
};

export function createRoom(userName: string): Promise<AckResponse> {
  return new Promise((resolve) => {
    socket.emit('room:create', { userName }, (response: AckResponse) => {
      resolve(response);
    });
  });
}

export function joinRoom(roomId: string, userName: string): Promise<AckResponse> {
  return new Promise((resolve) => {
    socket.emit('room:join', { roomId, userName }, (response: AckResponse) => {
      resolve(response);
    });
  });
}

export function subscribeLobbyUpdate(onUpdate: (room: LobbyRoom) => void) {
  socket.on('lobby:update', onUpdate);
  return () => {
    socket.off('lobby:update', onUpdate);
  };
}
