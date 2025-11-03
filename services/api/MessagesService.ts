// services/MessagesService.ts
import NetworkService from "./NetworkService";
import type { Message } from "~/types";

class MessagesService {
  async getMessages(roomId: string): Promise<Message[]> {
    return await NetworkService.get(`/v1/messages?roomId=${roomId}`);
  }

  async sendMessage(roomId: string, message: string): Promise<Message> {
    return await NetworkService.post("/v1/messages/send", { roomId, message });
  }
}

export default new MessagesService();
