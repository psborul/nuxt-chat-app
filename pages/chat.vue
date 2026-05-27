<template>
  <div class="chat-wrapper">
    <div ref="chat" class="chat">
      <Message
        v-for="(msg, index) in messages"
        :key="`message-${index}`"
        :message="msg"
        :owner="msg.id === user.id"
      />
    </div>
    <div v-if="typingUsers.length" class="chat__typing">
      <p
        v-for="(typingUser, index) in typingUsers"
        :key="`typingUser-${index}`"
        class="chat__typing-user"
      >
        {{ typingUser.name }} is typing...
      </p>
    </div>
    <div class="chat__form">
      <ChatForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Message from '~/components/Message.vue'
import ChatForm from '~/components/ChatForm.vue'
import { useChatStore } from '~/stores/chat'

definePageMeta({ layout: 'chat', middleware: 'auth' })

const store = useChatStore()
const { user, messages } = storeToRefs(store)
const typingUsers = computed(() => store.typingUsers)

useHead({ title: () => `Room ${user.value.room ?? ''}` })

const chat = ref<HTMLElement | null>(null)

watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      if (chat.value) chat.value.scrollTop = chat.value.scrollHeight
    })
  },
)
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.chat__form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
}

.chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
  color: #000;
}

.chat__typing {
  position: absolute;
  display: flex;
  bottom: 50px;
}

.chat__typing-user:not(:first-child) {
  margin-left: 15px;
}
</style>
