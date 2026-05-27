import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'

export interface ChatUser {
  id: string
  name: string
  room: string
  typingStatus: boolean
}

export interface ChatMessage {
  id?: string
  name: string
  text: string
  time: string
}

export interface CreateUserPayload {
  name: string
  room: string
  typingStatus: boolean
}

function getSocket(): Socket {
  return useNuxtApp().$socket as Socket
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: null as ChatUser | null,
    messages: [] as ChatMessage[],
    users: [] as ChatUser[],
  }),

  getters: {
    typingUsers(state) {
      return state.users.filter(u => u.typingStatus && state.user?.id !== u.id)
    },
    typingStatus(state): boolean {
      return Boolean(state.user?.typingStatus)
    },
    isAuthenticated(state): boolean {
      return state.user !== null
    },
  },

  actions: {
    addMessage(msg: ChatMessage) {
      this.messages.push(msg)
    },
    setUsers(users: ChatUser[]) {
      this.users = users
    },
    setTypingStatusLocal(status: boolean) {
      if (this.user) this.user.typingStatus = status
    },
    clearData() {
      this.user = null
      this.messages = []
      this.users = []
    },

    async createUser(payload: CreateUserPayload) {
      const ack = (await getSocket().timeout(10_000).emitWithAck('createUser', payload)) as { id: string }
      this.user = { ...payload, id: ack.id }
    },

    joinRoom() {
      if (!this.user) return
      getSocket().emit('joinRoom', { name: this.user.name, room: this.user.room })
    },

    createMessage(msg: string) {
      if (!this.user) return
      getSocket().emit('createMessage', { msg })
    },

    setTypingStatus(status: boolean) {
      this.setTypingStatusLocal(status)
      if (!this.user) return
      getSocket().emit('setTypingStatus', { typingStatus: status })
    },

    leftRoom() {
      getSocket().emit('leftChat')
      this.clearData()
    },

    reconnect() {
      if (!this.user) return
      const { name, room, typingStatus } = this.user
      void this.createUser({ name, room, typingStatus })
        .then(() => this.joinRoom())
    },
  },
})
