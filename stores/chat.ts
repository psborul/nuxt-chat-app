import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'

export interface ChatUser {
  id?: string
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

function getSocket(): Socket {
  return useNuxtApp().$socket as Socket
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    user: {} as Partial<ChatUser>,
    messages: [] as ChatMessage[],
    users: [] as ChatUser[],
  }),

  getters: {
    typingUsers(state) {
      return state.users.filter(u => u.typingStatus && state.user.id !== u.id)
    },
    typingStatus(state): boolean {
      return Boolean(state.user.typingStatus)
    },
    isAuthenticated(state): boolean {
      return Object.keys(state.user).length > 0
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
      this.user = {}
      this.messages = []
      this.users = []
    },

    async createUser(payload: { name: string; room: string; typingStatus: boolean }) {
      const ack = await getSocket().emitWithAck('createUser', payload) as { id: string }
      this.user = { ...payload, id: ack.id }
    },

    joinRoom() {
      if (!this.user.id) return
      getSocket().emit('joinRoom', this.user)
    },

    createMessage(msg: string) {
      if (!this.user.id) return
      getSocket().emit('createMessage', { msg, id: this.user.id })
    },

    setTypingStatus(status: boolean) {
      this.setTypingStatusLocal(status)
      if (!this.user.id) return
      getSocket().emit('setTypingStatus', this.user)
    },

    leftRoom() {
      getSocket().emit('leftChat')
      this.clearData()
    },

    reconnect() {
      if (!this.isAuthenticated) return
      const { id, name, room, typingStatus } = this.user
      if (!name || !room) return
      void this.createUser({ name, room, typingStatus: Boolean(typingStatus) })
        .then(() => this.joinRoom())
    },
  },
})
