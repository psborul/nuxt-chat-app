const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const usersDB = require('../utils/users')();
const Message = require('../models/Message')();

io.on('connection', socket => {

  socket.on("createUser", (user, cb) => {
    usersDB.addUser({
      ...user,
      id: socket.id
    })

    cb({ id: socket.id })
  });

  socket.on("joinRoom", user => {
    const { room, name } = user;
    socket.join(room);
    io.to(room).emit('updateUsers', usersDB.getUsersByRoom(room));
    socket.emit('newMessage', new Message('admin', `Hello, ${name}`));
    socket.broadcast
      .to(room)
      .emit('newMessage', new Message('admin', `User ${name} connected to chat`));
  });

  socket.on('createMessage', (data, cb) => {
    const { id, msg } = data;
    const user = usersDB.getUser(id);
    if (user) {
      io.to(user.room).emit('newMessage', new Message(user.name, msg, id))
    }
    cb()
  });

  socket.on('setTypingStatus', user => {
    // add status to DB that new users can see, who is typing at the moment
    if (user) {
      socket.broadcast
      .to(user.room)
      .emit('setTypingStatus', user);
    }
  })

  socket.on('leftChat', () => {
    const id = socket.id;
    const user = usersDB.getUser(id);
    const { room, name } = user;
    if (user) {
      usersDB.removeUser(id);
      socket.leave(room);
      io.to(room).emit('updateUsers', usersDB.getUsersByRoom(room));
      io.to(room).emit('newMessage', new Message('admin', `User ${name} left chat`))
    }
  });

  socket.on('disconnect', () => {
    const id = socket.id;
    const user = usersDB.getUser(id);
    const { room, name } = user;
    if (user) {
      usersDB.removeUser(id);
      socket.leave(room);
      io.to(room).emit('updateUsers', usersDB.getUsersByRoom(room));
      io.to(room).emit('newMessage', new Message('admin', `User ${name} left chat`))
    }
  });
})

module.exports = {
  app,
  server
}