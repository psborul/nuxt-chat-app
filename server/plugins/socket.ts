import type { Server as HttpServer } from 'node:http'
import { Server as IOServer, type Socket } from 'socket.io'
import { Message } from '../utils/Message'
import { usersDB } from '../utils/users'

let io: IOServer | null = null

function attachHandlers(server: IOServer) {
  server.on('connection', (socket: Socket) => {
    socket.on('createUser', (user, ack) => {
      usersDB.addUser({
        id: socket.id,
        name: user?.name ?? '',
        room: user?.room ?? '',
        typingStatus: Boolean(user?.typingStatus),
      })
      if (typeof ack === 'function') ack({ id: socket.id })
    })

    socket.on('joinRoom', ({ name, room }: { name: string; room: string }) => {
      socket.join(room)
      server.to(room).emit('updateUsers', usersDB.getUsersByRoom(room))
      socket.emit('newMessage', new Message('admin', `Hello, ${name}`))
      socket.broadcast
        .to(room)
        .emit('newMessage', new Message('admin', `User ${name} connected to chat`))
    })

    socket.on('createMessage', ({ id, msg }: { id: string; msg: string }) => {
      const user = usersDB.getUser(id)
      if (!user) return
      server.to(user.room).emit('newMessage', new Message(user.name, msg, id))
    })

    socket.on(
      'setTypingStatus',
      ({ room, typingStatus, id }: { room: string; typingStatus: boolean; id: string }) => {
        usersDB.setTypingStatus(id, typingStatus)
        server.to(room).emit('updateUsers', usersDB.getUsersByRoom(room))
      },
    )

    const exitEvents = ['leftChat', 'disconnect'] as const
    exitEvents.forEach((event) => {
      socket.on(event, () => {
        const user = usersDB.getUser(socket.id)
        if (!user) return
        const { room, name } = user
        usersDB.removeUser(socket.id)
        socket.leave(room)
        server.to(room).emit('updateUsers', usersDB.getUsersByRoom(room))
        server
          .to(room)
          .emit('newMessage', new Message('admin', `User ${name} left chat`))
      })
    })
  })
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hookOnce('request', (event) => {
    if (io) return
    const httpServer = (event.node?.req?.socket as { server?: HttpServer } | undefined)?.server
    if (!httpServer) return
    io = new IOServer(httpServer, {
      cors: { origin: '*' },
      // Path defaults to /socket.io; matches client default
    })
    attachHandlers(io)
  })
})
