class Users {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users = [...this.users, user]
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUsersByRoom(room) {
    return this.users.filter(user => user.room === room);
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }
}

module.exports = () => {
  return new Users()
}
