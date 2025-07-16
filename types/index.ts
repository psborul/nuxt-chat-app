import type { MESSAGE_ACTION, MESSAGE_TYPE } from '~/services/SocketService';

// server/api/ws.rooms.ts
import type { defineWebSocketHandler } from 'h3';

export type Peer = ReturnType<typeof defineWebSocketHandler>['open'] extends (peer: infer T) => any ? T : never;

export type DB = Record<string, unknown>;

export type User = {
  id: string;
  email: string;
  rooms: string[];
  typingStatus?: boolean;
  room?: string; // to remove in the future
  passwordHash: string;
  passwordSalt: string;
  roomId: string;
  username: string;
  online: boolean;
};

export type Message = {
  content: string;
  type: MESSAGE_TYPE;
  createdAt: number;
  id: string;
  userId?: string;
};

export type BroadcastMessage = {
  roomId: string;
  content: Message;
  excludeUserId?: string;
  userId?: string;
};

export type SocketAction = {
  type: MESSAGE_ACTION;
  roomId: string;
  userId: string;
  message?: string;
}

export type Room = {
  id: string;
  users: string[];
  name: string;
  ownerId: string;
  createdAt: Date;
  isPrivate: boolean;
  createdBy: string;
  joined: boolean;
  isOwner: boolean;
  //TODO: MAYBE TO REPLACE SOMEWHERE OR WORK WITH IT IN DIFFERENT WAY
};