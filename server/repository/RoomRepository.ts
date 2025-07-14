import { Room } from "./index";

export class RoomRepository {
  private rooms = new Map<string, Room>();

  createRoom({
    name,
    createdBy,
    isPrivate,
  }: {
    name: string;
    createdBy: string;
    isPrivate: boolean;
  }) {
    const id = uuid();
    const createdAt = new Date().toISOString();

    this.rooms.set(
      id,
      new Room({
        id,
        name,
        isPrivate,
        createdBy,
        createdAt,
      })
    );

    return id;
  }

  deleteRoom(id: string) {
    this.rooms.delete(id);
  }

  getRoom(id: string) {
    return this.rooms.get(id);
  }

  getAll(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export default new RoomRepository();
