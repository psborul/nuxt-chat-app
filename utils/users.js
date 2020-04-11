class Users {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users = [...this.users, user];
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  setUser(id, newUserData) {
    const index = this.users.findIndex(user => user.id === id);
    this.users[index] = newUserData;
  }

  nextUser(id, room) {
    const usersInSameRoom = this.getUsersByRoom(room);
    const currentUserIndex = usersInSameRoom.findIndex(user => user.id === id);
    var nextUserRoomIndex = -1;
    if (currentUserIndex !== usersInSameRoom.length - 1) {
      nextUserRoomIndex = currentUserIndex + 1;
    } else {
      nextUserRoomIndex = 0;
    }
    const nextUser = usersInSameRoom[nextUserRoomIndex];
    nextUser.hasTurn = true;
    this.setUser(nextUser.id, nextUser);
  }

  getUsersByRoom(room) {
    return this.users.filter(user => user.room === room);
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }
}

module.exports = () => {
  return new Users();
};
