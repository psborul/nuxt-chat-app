import NetworkService from "./NetworkService";
import type { Room } from "~/types";

class RoomService {
  async getAllByUserId(userId: string): Promise<Room[]> {
    return NetworkService.get(`/rooms?userId=${userId}`);
  }

  async getById(roomId: string): Promise<Room> {
    return NetworkService.get(`/rooms?roomId=${roomId}`);
  }

  async create(name: string): Promise<Room> {
    return NetworkService.post(`/rooms`, { name });
  }

  async delete(roomId: string): Promise<void> {
    return NetworkService.post(`/rooms/delete`, { roomId });
  }

  async join(roomId: string): Promise<void> {
    return NetworkService.post(`/rooms/join`, { roomId });
  }

  async leave(roomId: string): Promise<void> {
    return NetworkService.post(`/rooms/leave`, { roomId });
  }
}

export default new RoomService();
