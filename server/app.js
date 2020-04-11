const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const users = require("../utils/users")();
const Message = require("../utils/message")();
const Memory = require("../utils/memory")();

io.on("connection", (socket) => {
  socket.on("createUser", (user, cb) => {
    users.addUser({
      ...user,
      id: socket.id,
    });
    cb({ id: socket.id });
  });

  socket.on("checkRoom", (user, cb) => {
    const usersInRoom = users.getUsersByRoom(user.room).length;
    cb(usersInRoom);
  });

  socket.on("joinRoom", (user) => {
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

  socket.on("createGame", (user, amount) => {
    console.log("socket.on(createGame)", user);
    const cardsArray = Memory.initCardsArray(amount);
    console.log("memory get files", Memory.getFiles());
    users.nextUser(user.id, user.room);
    io.to(user.room).emit(
      "newMessage",
      new Message("admin", `new Game started`)
    );
    io.to(user.room).emit("setCards", cardsArray);
    io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
  });

  socket.on("flipCard", (user, flippedCard, cb) => {
    console.log("socket.on(flipCard)", user);
    const data = Memory.flipCard(flippedCard);
    socket.emit("flipCard", data.cardsChosen);
    io.to(user.room).emit("newMessage", new Message("admin", `card flipped`));
    io.to(user.room).emit("setCards", data.cards);
    cb();
  });

  socket.on("checkForMatch", (user) => {
    console.log("socket.on(checkForMatch)", user);
    const data = Memory.checkForMatch();
    if (data.result) {
      //Paar gefunden
      user.score++;
      users.setUser(user.id, user);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      socket.emit("setUser", user);
    } else {
      users.nextUser(user.id, user.room);
      io.to(user.room).emit("updateUsers", users.getUsersByRoom(user.room));
      //socket.emit("setUser", user);
    }
    socket.emit("checkForMatch", data);
    io.to(user.room).emit("setCards", data.cards);
    socket.broadcast
      .to(user.room)
      .emit("newMessage", new Message("admin", `checked ${data.result}`));
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
  // Memory Test
  socket.on("nextTurn", (data, cb) => {
    console.log("app.js-socket.on(nextTurn)", data);
    const user = users.getUser(data.id);
    if (user) {
      const nextUser = users.getNextUserInRoom(user.id, user.room);
      console.log(user, nextUser);
      io.to(user.room).emit("nextUser", nextUser.id);
    }
    cb();
  });

  socket.on("leftChat", (cb) => {
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
  server,
};
