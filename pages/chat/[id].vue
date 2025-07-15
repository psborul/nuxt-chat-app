<template>
  <div class="chat-page">
    <aside class="sidebar">
      <p>Users in room:</p>
      <ul>
        <li v-for="userItem in users" :key="userItem.id">
          {{ userItem.username }}
        </li>
      </ul>
    </aside>

    <main class="chat-page__main">
      <header class="header">
        Room: {{ roomId }}
        <Button type="primary" @click.prevent="handleLeave">LEAVE</Button>
      </header>

      <div class="message-window">
        <div ref="messageContainer" class="message-view">
          <MessageItem
            v-for="message in messages"
            :id="message.id"
            :key="message.id"
            :content="message.content"
            :created-at="message.createdAt"
            :self="message.userId === user?.id"
            :type="message.type || ''"
          />
        </div>

        <form class="form" @submit.prevent="handleSubmit">
          <Textfield v-model="text" class="form__input" placeholder="Type a message..." />
          <Button type="primary" class="form__button">Send</Button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import MessageItem from '~/components/MessageItem.vue'
import NetworkService from '~/services/NetworkService'
import SocketService, { SOCKET_EVENT_TYPE } from '~/services/SocketService'
import Storage from '~/services/Storage'
import type { Message, User } from '~/types'

const router = useRouter()
const { params } = useRoute()
const roomId = params.id as string

const text = ref('')
const user = ref<User>()
const users = ref<User[]>([])
const messages = ref<Message[]>([])

const messageContainer = ref<HTMLElement | null>(null)

const fetchUsers = async () => {
  users.value = await NetworkService.get(`/api/users?roomId=${roomId}`)
}

const fetchMessages = async () => {
  messages.value = await NetworkService.get(`/api/messages?roomId=${roomId}`)
}

const socketUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/socket?token=${Storage.get<User>(STORAGE_USER_KEY).token}`
const socketService = new SocketService(socketUrl)

onMounted(async () => {
  user.value = Storage.get<User>(STORAGE_USER_KEY)
  await fetchMessages()
  await fetchUsers()

  socketService.connect()

  socketService.emitter.$on(SOCKET_EVENT_TYPE.OPEN, () => {
    socketService.joinRoom({ roomId })
  })

  socketService.emitter.$on(SOCKET_EVENT_TYPE.MESSAGE, (data) => {
    messages.value.push(data)
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  })

  window.addEventListener('beforeunload', handleLeave)
})

onBeforeUnmount(() => {
  socketService.disconnect()
  window.removeEventListener('beforeunload', handleLeave)
})

const handleSubmit = () => {
  if (!text.value.trim()) return

  socketService.sendMessage({
    message: text.value,
    roomId,
  })

  text.value = ''
}

const handleLeave = () => {
  socketService.leaveRoom({ roomId })
  router.push({ name: ROUTE.ROOMS })
}

definePageMeta({ middleware: 'auth' })
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  height: 100vh;
  background-color: var(--bg);
  color: var(--text);

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.sidebar {
  background-color: var(--surface-hover);
  color: var(--text);
  padding: 10px;
  border-right: 1px solid var(--border);
  min-width: 180px;
}

.header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.message-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
}

.message-view {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px; // 👈 tighter spacing
  scroll-behavior: smooth;
}

.form {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background-color: var(--surface);
  border-top: 1px solid var(--border);

  &__input {
    flex: 1;
  }

  &__button {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .chat-page {
    flex-direction: column;
  }

  .sidebar {
    order: 2;
    border-right: none;
    border-top: 1px solid var(--border);
  }

  .form {
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
}
</style>
