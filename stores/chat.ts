import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { CREATE_USER_TIMEOUT_MS, SOCKET_EVENTS } from '~~/shared/constants'

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
      return state.users.filter(user => user.typingStatus && state.user?.id !== user.id)
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
      const ack = (await getSocket()
        .timeout(CREATE_USER_TIMEOUT_MS)
        .emitWithAck(SOCKET_EVENTS.CREATE_USER, payload)) as { id: string }
      this.user = { ...payload, id: ack.id }
    },

    joinRoom() {
      if (!this.user) return
      getSocket().emit(SOCKET_EVENTS.JOIN_ROOM, { name: this.user.name, room: this.user.room })
    },

    createMessage(msg: string) {
      if (!this.user) return
      getSocket().emit(SOCKET_EVENTS.CREATE_MESSAGE, { msg })
    },

    setTypingStatus(status: boolean) {
      this.setTypingStatusLocal(status)
      if (!this.user) return
      getSocket().emit(SOCKET_EVENTS.SET_TYPING_STATUS, { typingStatus: status })
    },

    leftRoom() {
      getSocket().emit(SOCKET_EVENTS.LEFT_CHAT)
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
