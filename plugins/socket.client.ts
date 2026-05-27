import { io, type Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '~~/shared/constants'
import { useChatStore } from '~/stores/chat'

export default defineNuxtPlugin(() => {
  const socket: Socket = io('/', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 15,
  })

  const store = useChatStore()

  socket.on(SOCKET_EVENTS.NEW_MESSAGE, msg => store.addMessage(msg))
  socket.on(SOCKET_EVENTS.UPDATE_USERS, users => store.setUsers(users))
  socket.io.on('reconnect', () => store.reconnect())

  return {
    provide: { socket },
  }
})
