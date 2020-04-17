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

  setUser(newUserData) {
    const index = this.users.findIndex(user => user.id === newUserData.id);
    this.users[index] = newUserData;
  }

  waitingUsers(room) {
    const usersInRoom = this.getUsersByRoom(room);
    const waitingUsers = usersInRoom.filter(
      user => user.finishedWaiting === false
    );
    return waitingUsers.length;
  }

  startWaiting(room) {
    this.users.map(user => {
      if (user.room === room) {
        user.finishedWaiting = false;
      }
    });
  }

  nextUser(callingUser) {
    const usersInSameRoom = this.getUsersByRoom(callingUser.room);
    if (!usersInSameRoom.length) {
      callingUser.hasTurn = true;
      // callingUser.isCreator = true;
      this.addUser(callingUser);
      return;
    }
    if (usersInSameRoom && usersInSameRoom.length === 1) {
      callingUser.hasTurn = true;
      // callingUser.isCreator = true;
      this.setUser(callingUser);
      return;
    }
    //hasTurn von allen usern entfernen
    this.users.map(user => {
      if (user.room === callingUser.room) {
        user.hasTurn = false;
      }
    });
    const currentUserIndex = usersInSameRoom.findIndex(
      user => user.id === callingUser.id
    );
    var nextUserRoomIndex = 0;
    console.log("next user find current: ", currentUserIndex, usersInSameRoom);
    if (currentUserIndex < usersInSameRoom.length - 1) {
      nextUserRoomIndex = currentUserIndex + 1;
    }
    const nextUser = usersInSameRoom[nextUserRoomIndex];
    // const currentUser = usersInSameRoom[currentUserIndex];
    // currentUser.hasTurn = false;
    nextUser.hasTurn = true;
    console.log(callingUser, nextUser);
    // this.setUser(currentUser.id, currentUser);
    this.setUser(nextUser);
  }

  getUsersByRoom(room) {
    const usersInSameRoom = this.users.filter(user => user.room === room);
    if (usersInSameRoom.length) {
      usersInSameRoom[0].isCreator = true;
      this.setUser(usersInSameRoom[0]);
    }
    return usersInSameRoom;
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }
}

module.exports = () => {
  return new Users();
};
