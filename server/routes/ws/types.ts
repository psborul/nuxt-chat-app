import type { MESSAGE_ACTION } from '~/services/SocketService';

// types/socket.ts
export type SocketMessageType = 'system' | 'user';

export type SocketMessage = {
  id: string;
  content: string;
  type: SocketMessageType;
  createdAt: number;
  userId: string;
};

export type SocketAction = {
  type: MESSAGE_ACTION
  roomId?: string;
  message?: string;
};

export type TokenPayload = {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
};

export interface PeerContext {
  user?: TokenPayload;
}
