import { Message } from "./index";

export class MessageRepository {
  private messages: Message[] = [];

  add(roomId: string, userId: string, content: string): Message {
    const id = uuid();
    const createdAt = new Date();
    const msg = new Message({
      roomId,
      userId,
      content,
      id,
      createdAt,
    });
    this.messages.push(msg);
    
    return msg;
  }

  getRoomMessages(roomId: string): Message[] {
    return this.messages.filter((m) => m.roomId === roomId);
  }
}

export default new MessageRepository();
