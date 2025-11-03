import NetworkService from "./NetworkService";
import type { Room } from "~/types";

class RoomService {
  async getAllByUserId(userId: string): Promise<Room[]> {
    return await NetworkService.get(`v1/rooms`);
  }

  async getById(roomId: string): Promise<Room> {
    return await NetworkService.get(`v1/rooms/${roomId}`);
  }

  async create(name: string): Promise<Room> {
    return await NetworkService.post(`v1/rooms`, { name });
  }

  async delete(roomId: string): Promise<void> {
    return await NetworkService.post(`v1/rooms/delete`, { roomId });
  }

  async join(roomId: string): Promise<void> {
    return await NetworkService.post(`v1/rooms/join`, { roomId });
  }

  async leave(roomId: string): Promise<void> {
    return await NetworkService.post(`v1/rooms/leave`, { roomId });
  }
}

export default new RoomService();
