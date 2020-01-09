const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const users = require('../utils/users')();
const Message = require('../utils/message')();

io.on('connection', socket => {

  socket.on("createUser", (user, cb) => {
    users.addUser({
      ...user,
      id: socket.id
    })
    cb({ id: socket.id })
  });

  socket.on("joinRoom", user => {
    socket.join(user.room);
    io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
    socket.emit('newMessage', new Message('admin', `Hello, ${user.name}`));
    socket.broadcast
      .to(user.room)
      .emit('newMessage', new Message('admin', `User ${user.name} connected to chat`));
  });

  socket.on('createMessage', (data, cb) => {
    const user = users.getUser(data.id);
    if (user) {
      io.to(user.room).emit('newMessage', new Message(user.name, data.text, data.id))
    }
    cb()
  });

  socket.on('leftChat', (cb) => {
    const id = socket.id;
    const user = users.getUser(id);
    if (user) {
      users.removeUser(id);
      socket.leave(user.room);
      io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
      io.to(user.room).emit('newMessage', new Message('admin', `User ${user.name} left chat`))
    }
    cb()
  });

  socket.on('disconnect', () => {
    const id = socket.id;
    const user = users.getUser(id);
    if (user) {
      users.removeUser(id);
      socket.leave(user.room);
      io.to(user.room).emit('updateUsers', users.getUsersByRoom(user.room));
      io.to(user.room).emit('newMessage', new Message('admin', `User ${user.name} left chat`))
    }
  });
})

module.exports = {
  app,
  server
}