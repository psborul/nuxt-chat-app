import { defineWebSocketHandler } from "h3";
import {
  broadcastSystemMessage,
  broadcastToRoom,
  joinRoom,
  leaveRoom,
} from "./room";
import { uuid } from "~/utils/helpers";
import UserRepository from "~/server/repository/UserRepository";
import PeerRepository from "~/server/repository/PeerRepository";
import MessageRepository from "~/server/repository/MessageRepository";
import { MESSAGE_TYPE, MESSAGE_ACTION } from "~/services/SocketService";
import type { TokenPayload, SocketAction } from "./types";

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] client connected");

    const reqUrl = peer.websocket.url || "";
    const token = new URLSearchParams(reqUrl.split("?")[1]).get("token");

    if (!token) {
      peer.close(4001, "Missing token");
      return;
    }

    try {
      const user = {
        id: '123',
        username: "username"
      }
      UserRepository.setOnline(user.id, true);

      peer.context.user = user; // Save decoded user to peer context
      PeerRepository.add(peer);

      console.log("✅ User connected:", user.username);
    } catch (err) {
      console.warn("❌ Invalid token");
      peer.close(4002, "Invalid token");
    }
  },

  message(peer, message) {
    try {
      if (!peer.context.user) {
        peer.close(4003, "Unauthorized");
        return;
      }

      const raw = message.text();
      const data: SocketAction = JSON.parse(raw);

      const user = UserRepository.findById(peer.context.user.id);
      if (!user) throw new Error("Unauthorized peer");

      const userId = user.id;

      if (data.type === MESSAGE_ACTION.JOIN && data.roomId) {
        joinRoom({ peer, roomId: data.roomId, userId });

        broadcastSystemMessage({
          message: `${user.username} joined channel`,
          roomId: data.roomId,
          excludeUserId: userId,
        });

        return;
      }

      if (data.type === MESSAGE_ACTION.LEAVE && data.roomId) {
        leaveRoom({ userId, roomId: data.roomId });

        broadcastSystemMessage({
          message: `${user.username} left channel`,
          roomId: data.roomId,
          excludeUserId: userId,
        });

        return;
      }

      if (data.type === MESSAGE_ACTION.CHAT && data.roomId && data.message) {
        const msg = {
          content: `${user.username}: ${data.message}`,
          type: MESSAGE_TYPE.USER,
          createdAt: Date.now(),
          id: uuid(),
          userId,
        };

        broadcastToRoom({
          content: msg,
          roomId: data.roomId,
          excludeUserId: userId,
        });

        const saved = MessageRepository.add(data.roomId, userId, data.message);

        peer.send({
          ...msg,
          content: saved.content,
        });
      }
    } catch (err) {
      console.error("Invalid message format", err);
    }
  },

  close(peer) {
    const user = peer.context.user;
    if (!user) return;

    console.log("[ws] client disconnected");
    UserRepository.setOnline(user.id, false);
    PeerRepository.remove(peer.id);
    // Optional: remove peer from PeerRepository here
  },

  error(peer, error) {
    console.error("[ws error]", error);
  },
});
