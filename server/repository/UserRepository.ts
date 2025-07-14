import { v4 as uuid } from 'uuid';
import { User } from './index';

class UserRepository {
  private users = new Map<string, User>();

  create(userData: Omit<User, 'id'>): User {
    const id = uuid();
    const user = new User({ ...userData, id });
    this.users.set(id, user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  findByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  setOnline(id: string, online: boolean): void {
    const user = this.users.get(id);
    if (user) {
      user.online = online;
    }
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }
}

export default new UserRepository();