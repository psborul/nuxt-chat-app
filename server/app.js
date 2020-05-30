const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const usersDB = require("../utils/users")();
const Message = require("../models/Message")();

io.on("connection", (socket) => {
  socket.on("createUser", (user) => {
    usersDB.addUser({
      ...user,
      id: socket.id,
    });

    return { id: socket.id };
  });

  socket.on("joinRoom", ({ name, room }) => {
    socket.join(room);
    io.to(room).emit("updateUsers", usersDB.getUsersByRoom(room));
    socket.emit("newMessage", new Message("admin", `Hello, ${name}`));
    socket.broadcast
      .to(room)
      .emit(
        "newMessage",
        new Message("admin", `User ${name} connected to chat`),
      );
  });

  socket.on("createMessage", ({ id, msg }) => {
    const user = usersDB.getUser(id);
    if (user) {
      io.to(user.room).emit("newMessage", new Message(user.name, msg, id));
    }
  });

  socket.on("setTypingStatus", ({ room, typingStatus, id }) => {
    usersDB.setTypingStatus(id, typingStatus);
    io.to(room).emit("updateUsers", usersDB.getUsersByRoom(room));
  });

  const exitEvents = ["leftChat", "disconnect"];

  exitEvents.forEach((event) => {
    socket.on(event, () => {
      const id = socket.id;
      const user = usersDB.getUser(id);
      if (!user) return;
      const { room, name } = user;
      usersDB.removeUser(id);
      socket.leave(room);
      io.to(room).emit("updateUsers", usersDB.getUsersByRoom(room));
      io.to(room).emit(
        "newMessage",
        new Message("admin", `User ${name} left chat`),
      );
    });
  });
});

module.exports = {
  app,
  server,
};
