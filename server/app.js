const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const users = require("../utils/users")();
const games = require("../utils/games")();
const Message = require("../utils/message")();

io.on("connection", socket => {
  socket.on("createUser", (user, cb) => {
    users.addUser({
      ...user,
      id: socket.id
    });
    cb({ id: socket.id });
  });

  socket.on("checkRoom", (user, cb) => {
    const usersInRoom = users.getUsersByRoom(user.room).length;
    cb(usersInRoom);
  });

  socket.on("joinRoom", user => {
    console.log("socket.on(joinRoom)", user);
    socket.join(user.room);
    io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
    socket.emit("newMessage", new Message("admin", `Hello, ${user.name}`));
    socket.broadcast
      .to(user.room)
      .emit(
        "newMessage",
        new Message("admin", `User ${user.name} connected to chat`)
      );
  });

  socket.on("finishedWaiting", user => {
    console.log("socket.on(finishedWaiting)", user);
    users.setUser(user);
    const waitingUsers = users.waitingUsers(user.room);
    io.to(user.room).emit("waitingUsers", waitingUsers);
    // io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
    //io.to(user.room).emit("newMessage", new Message("admin", `${user.name} finished Waiting`));
  });

  socket.on("newGame", (user, amount) => {
    console.log("socket.on(createGame)", user, amount);
    // const cardsArray = Memory.initCardsArray(amount);
    // console.log("memory get files", Memory.getFiles());
    games.newGame(user.room, amount);
    const game = games.getGameInRoom(user.room);
    users.nextUser(user);
    io.to(user.room).emit(
      "newMessage",
      new Message("admin", `new Game started`)
    );
    // io.to(user.room).emit("checkForMatch", {
    //   result: false,
    //   cardsChosen: Memory.getCardsChosen()
    // });
    io.to(user.room).emit("setGame", game);
    io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
  });

  socket.on("flipCard", (user, flippedCard, cb) => {
    console.log("socket.on(flipCard)", user);
    users.startWaiting(user.room);
    const game = games.flipCard(user.room, flippedCard);
    io.to(user.room).emit("setGame", game);
    io.to(user.room).emit("newMessage", new Message("admin", `card flipped`));
    //io.to(user.room).emit("setCards", data.cards);
    cb();
  });

  socket.on("checkForMatch", (user, cb) => {
    console.log("socket.on(checkForMatch)", user);
    users.startWaiting(user.room);
    const data = games.checkForMatch(user.room);
    if (data.result) {
      //Paar gefunden
      user.score++;
      users.setUser(user);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      socket.emit("setUser", user);
    } else {
      users.nextUser(user);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      //socket.emit("setUser", user);
    }
    //socket.emit("checkForMatch", data);
    //io.to(user.room).emit("setCards", data.cards);
    io.to(user.room).emit("setGame", data.game);
    io.to(user.room).emit(
      "newMessage",
      new Message("admin", `checked ${data.result}`)
    );
    cb();
  });

  socket.on("createMessage", (data, cb) => {
    console.log("app.js-socket.on(createMessage)", data);
    const user = users.getUser(data.id);
    if (user) {
      io.to(user.room).emit(
        "newMessage",
        new Message(user.name, data.text, data.id)
      );
    }
    cb();
  });

  socket.on("kickUser", userToKick => {
    const user = users.getUser(userToKick.id);
    if (user) {
      // users.removeUser(user.id);
      // socket.leave(user.room);
      io.to(user.id).emit("gotKicked");
      // io.to(user.room).emit(
      //   "newMessage",
      //   new Message("admin", `User ${user.name} got kicked`)
      // );
    }
  });

  socket.on("leftChat", cb => {
    const id = socket.id;
    const user = users.getUser(id);
    if (user) {
      users.removeUser(id);
      const usersLeftInRoom = users.getUsersByRoom(user.room).length;
      if (!usersLeftInRoom) {
        games.removeGame(user.room);
        return;
      }
      socket.leave(user.room);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      io.to(user.room).emit(
        "newMessage",
        new Message("admin", `User ${user.name} left chat`)
      );
    }
    cb();
  });

  socket.on("disconnect", () => {
    const id = socket.id;
    const user = users.getUser(id);
    if (user) {
      users.removeUser(id);
      socket.leave(user.room);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      io.to(user.room).emit(
        "newMessage",
        new Message("admin", `User ${user.name} left chat`)
      );
    }
  });
});

module.exports = {
  app,
  server
};
