<template>
  <v-form ref="form" @submit.prevent="send">
    <v-text-field
      v-model="text"
      label="Message..."
      variant="outlined"
      :rules="rules"
      append-inner-icon="mdi-send-circle-outline"
      @update:model-value="typing"
      @click:append-inner="send"
      @blur="resetValidation"
    />
  </v-form>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

const store = useChatStore()

const form = ref<{
  validate: () => Promise<{ valid: boolean }>
  reset: () => void
  resetValidation: () => void
} | null>(null)
const text = ref('')
const rules = [(v: string) => !!v || 'Text is required']

async function send() {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  store.createMessage(text.value)
  store.setTypingStatus(false)
  form.value.reset()
}

function resetValidation() {
  form.value?.resetValidation()
}

function typing() {
  if (!store.typingStatus) {
    store.setTypingStatus(true)
  }
}
</script>
