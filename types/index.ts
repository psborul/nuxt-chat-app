import type { MESSAGE_TYPE } from '~/services/SocketService';

export type User = {
  id: string;
  email: string;
  username: string;
  token: string;
};

export type Message = {
  id: string;
  content: string;
  type: MESSAGE_TYPE;
  createdAt: number | string;
  userId?: string;
  username?: string;
};

export type Room = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  isPrivate: boolean;
  users: Array<{
    id: string;
    username: string;
    online: boolean;
  }>;
  joined: boolean;
  isOwner: boolean;
};

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';