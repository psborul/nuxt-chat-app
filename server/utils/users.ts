export interface ChatUser {
  id: string
  name: string
  room: string
  typingStatus: boolean
}

export class UsersDB {
  private users: ChatUser[] = []

  addUser(user: ChatUser) {
    this.users = [...this.users, user]
  }

  getUser(id: string): ChatUser | undefined {
    return this.users.find(u => u.id === id)
  }

  getUsersByRoom(room: string): ChatUser[] {
    return this.users.filter(u => u.room === room)
  }

  removeUser(id: string) {
    this.users = this.users.filter(u => u.id !== id)
  }

  setTypingStatus(id: string, typingStatus: boolean) {
    const user = this.users.find(u => u.id === id)
    if (user) user.typingStatus = typingStatus
  }
}

export const usersDB = new UsersDB()
