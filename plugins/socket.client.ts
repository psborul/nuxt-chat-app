import { io, type Socket } from 'socket.io-client'
import { useChatStore } from '~/stores/chat'

export default defineNuxtPlugin(() => {
  const socket: Socket = io('/', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 15,
  })

  const store = useChatStore()

  socket.on('newMessage', (msg) => store.addMessage(msg))
  socket.on('updateUsers', (users) => store.setUsers(users))
  socket.io.on('reconnect', () => store.reconnect())

  return {
    provide: { socket },
  }
})
