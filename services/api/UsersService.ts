import NetworkService from "./NetworkService";
import type { User } from "~/types";

class UsersService {
  async getUsers(roomId: string): Promise<User[]> {
    return NetworkService.get(`/users?roomId=${roomId}`);
  }
}

export default new UsersService();
