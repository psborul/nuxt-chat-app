import type { Server as HttpServer } from 'node:http'
import { Server as IOServer, type Socket } from 'socket.io'
import {
  MAX_MSG_LEN,
  MAX_NAME_LEN,
  MAX_ROOM_LEN,
  SOCKET_EVENTS,
  SYSTEM_AUTHOR,
} from '../../shared/constants'
import { Message } from '../utils/Message'
import { usersDB } from '../utils/users'

let io: IOServer | null = null

function isCleanString(v: unknown, maxLen: number): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= maxLen
}

function attachHandlers(server: IOServer) {
  server.on('connection', (socket: Socket) => {
    socket.on(SOCKET_EVENTS.CREATE_USER, (user: unknown, ack) => {
      const u = user as { name?: unknown; room?: unknown; typingStatus?: unknown } | undefined
      if (!isCleanString(u?.name, MAX_NAME_LEN) || !isCleanString(u?.room, MAX_ROOM_LEN)) return
      usersDB.addUser({
        id: socket.id,
        name: u.name as string,
        room: u.room as string,
        typingStatus: Boolean(u?.typingStatus),
      })
      if (typeof ack === 'function') ack({ id: socket.id })
    })

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (_payload: unknown) => {
      // Source of truth is server-side state, not the client-supplied payload.
      const user = usersDB.getUser(socket.id)
      if (!user) return
      const { name, room } = user
      socket.join(room)
      server.to(room).emit(SOCKET_EVENTS.UPDATE_USERS, usersDB.getUsersByRoom(room))
      socket.emit(SOCKET_EVENTS.NEW_MESSAGE, new Message(SYSTEM_AUTHOR, `Hello, ${name}`))
      socket.broadcast
        .to(room)
        .emit(SOCKET_EVENTS.NEW_MESSAGE, new Message(SYSTEM_AUTHOR, `User ${name} connected to chat`))
    })

    socket.on(SOCKET_EVENTS.CREATE_MESSAGE, (payload: unknown) => {
      const p = payload as { msg?: unknown } | undefined
      if (!isCleanString(p?.msg, MAX_MSG_LEN)) return
      // Ignore any client-supplied id; only trust socket.id.
      const user = usersDB.getUser(socket.id)
      if (!user) return
      server.to(user.room).emit(
        SOCKET_EVENTS.NEW_MESSAGE,
        new Message(user.name, p.msg as string, socket.id),
      )
    })

    socket.on(SOCKET_EVENTS.SET_TYPING_STATUS, (payload: unknown) => {
      const p = payload as { typingStatus?: unknown } | undefined
      if (typeof p?.typingStatus !== 'boolean') return
      // Ignore any client-supplied room/id; only trust server state.
      const user = usersDB.getUser(socket.id)
      if (!user) return
      usersDB.setTypingStatus(socket.id, p.typingStatus)
      server.to(user.room).emit(SOCKET_EVENTS.UPDATE_USERS, usersDB.getUsersByRoom(user.room))
    })

    const exitEvents = [SOCKET_EVENTS.LEFT_CHAT, 'disconnect'] as const
    exitEvents.forEach((event) => {
      socket.on(event, () => {
        const user = usersDB.getUser(socket.id)
        if (!user) return
        const { room, name } = user
        usersDB.removeUser(socket.id)
        socket.leave(room)
        server.to(room).emit(SOCKET_EVENTS.UPDATE_USERS, usersDB.getUsersByRoom(room))
        server
          .to(room)
          .emit(SOCKET_EVENTS.NEW_MESSAGE, new Message(SYSTEM_AUTHOR, `User ${name} left chat`))
      })
    })
  })
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hookOnce('request', (event) => {
    if (io) return
    const httpServer = (event.node?.req?.socket as { server?: HttpServer } | undefined)?.server
    if (!httpServer) return
    const corsOrigin = process.env.SOCKET_IO_CORS_ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) ?? '*'
    io = new IOServer(httpServer, {
      cors: { origin: corsOrigin },
      // Path defaults to /socket.io; matches client default
    })
    attachHandlers(io)
  })
})
