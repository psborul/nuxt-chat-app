import { broadcastToRoom, joinRoom, leaveRoom } from './room';
import { uuid } from '~/utils/helpers';
import type { SocketAction } from '~/types';
import { MESSAGE_TYPE, MESSAGE_ACTION } from '~/services/SocketService';
import UserRepository from '~/server/repository/UserRepository';
import PeerRepository from '~/server/repository/PeerRepository';
import MessageRepository from '~/server/repository/MessageRepository';

export default defineWebSocketHandler({
  open(peer) {
    console.log('[ws] client connected');
    PeerRepository.add(peer);
  },

  message(peer, message) {
    const text = message.text();
    console.log('[ws] message:', text);

    try {
      const data: SocketAction = JSON.parse(text);
      const user = UserRepository.findById(data.userId)

      if (!user) {
        throw new Error("There is no such user")
      }

      if (data.type === MESSAGE_ACTION.JOIN && data.roomId) {
        joinRoom({
          peer,
          roomId: data.roomId,
          userId: data.userId
        });

        broadcastToRoom({
          content: {
            content: `${user.username} joined channel`,
            type: MESSAGE_TYPE.SYSTEM,
            createdAt: Date.now(),
            id: uuid(),
            userId: user.id

          },
          roomId: data.roomId,
          excludeUserId: data.userId
        });

        return;
      }

      if (data.type === MESSAGE_ACTION.LEAVE && data.roomId) {
        leaveRoom({
          userId: data.userId,
          roomId: data.roomId
        });
        // TODO: to remove peer only from the direct room, not all

        broadcastToRoom({
          content: {
            content: `${user.username} leaved channel`,
            type: MESSAGE_TYPE.SYSTEM,
            createdAt: Date.now(),
            id: uuid(),
            userId: user.id
          },
          roomId: data.roomId,
          excludeUserId: data.userId
        });

        return;
      }

      if (data.type === MESSAGE_ACTION.CHAT && data.roomId && data.message) {
        broadcastToRoom({
          content: {
            content: `${user.username}: ${data.message}`,
            type: MESSAGE_TYPE.USER,
            createdAt: Date.now(),
            id: uuid(),
            userId: user.id
          },
          roomId: data.roomId,
          excludeUserId: data.userId
        });

        const message = MessageRepository.add(data.roomId, data.userId, data.message);

        peer.send({
          content: message.content,
          type: MESSAGE_TYPE.USER,
          createdAt: message.createdAt,
          id: message.id,
          userId: message.userId
        });
      }
    } catch (err) {
      console.error('Invalid message format', err);
    }
  },

  close(peer) {
    //TODO: work with tab closing to remove peer
    console.log('[ws] client disconnected');
    // leaveRoom(peer);
  },

  error(error) {
    console.log('[error]', error);
  }
});
