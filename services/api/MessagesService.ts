// services/MessagesService.ts
import NetworkService from "./NetworkService";
import type { Message } from "~/types";

class MessagesService {
  async getMessages(roomId: string): Promise<Message[]> {
    return NetworkService.get(`/messages?roomId=${roomId}`);
  }

  async sendMessage(roomId: string, message: string): Promise<Message> {
    return NetworkService.post("/messages/send", { roomId, message });
  }
}

export default new MessagesService();
