import EmitterService from './EmitterService';

export const SOCKET_EVENT_TYPE = {
  "OPEN": "OPEN",
  "MESSAGE": "MESSAGE",
  "CLOSE": "CLOSE",
  "ERROR": "ERROR",
  "USER_JOIN": "USER_JOIN"
} as const;

export enum MESSAGE_ACTION {
  "JOIN" = "JOIN",
  "LEAVE" = "LEAVE",
  "CHAT" = "CHAT"
}

export enum MESSAGE_TYPE {
  "SYSTEM" = "SYSTEM",
  "USER" = "USER",
  "DATA" = "DATA"
};

export default class SocketService {
  private url: string;
  private socket: WebSocket | null = null;
  emitter = new EmitterService();

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    if (this.socket) return; // Prevent duplicate connections

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.emitter.$emit(SOCKET_EVENT_TYPE.OPEN);
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(event);
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        data = event.data;
      }

      this.emitter.$emit(SOCKET_EVENT_TYPE.MESSAGE, data);
    };

    this.socket.onclose = () => {
      this.emitter.$emit(SOCKET_EVENT_TYPE.CLOSE);
      console.log('WebSocket closed');
      this.socket = null;
    };

    this.socket.onerror = (err: Event) => {
      this.emitter.$emit(SOCKET_EVENT_TYPE, err);
      console.error('WebSocket error', err);
    };
  }

  joinRoom({ userId, roomId }: { userId: string; roomId: string; }) {
    console.log("JOINROOM");
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send({
        userId,
        type: MESSAGE_ACTION.JOIN,
        roomId: roomId,
      });
    } else {
      console.warn('WebSocket is not connected yet. Cannot send message:');
    }
  };

  leaveRoom({ userId, roomId }: { userId: string; roomId: string; }) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send({
        userId,
        type: MESSAGE_ACTION.LEAVE,
        roomId: roomId,
      });
    } else {
      console.warn('WebSocket is not connected yet. Cannot send message:');
    }
  };

  sendMessage(data: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const payload = {
        ...data,
        type: MESSAGE_ACTION.CHAT
      };
      this.send(payload);
    } else {
      console.warn('Cannot send, socket not open', data);
    }
  }

  private send(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('Cannot send, socket not open', data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.emitter.$removeListeners();
    }
  }
}
