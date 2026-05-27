<template>
  <v-row no-gutters align="center" justify="center">
    <v-col cols="auto">
      <v-snackbar v-model="snackbar" :timeout="SNACKBAR_TIMEOUT_MS" :color="snackbarColor" location="top">
        {{ snackbarText }}
        <template #actions>
          <v-btn variant="text" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>

      <v-card min-width="290" color="#424242">
        <v-card-title>
          <h2>Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid" @submit.prevent="submit">
            <v-text-field
              v-model="user.name"
              :counter="MAX_NAME_LEN"
              :rules="nameRules"
              label="Name"
              required
            />
            <v-text-field
              v-model="user.room"
              :counter="MAX_ROOM_LEN"
              :rules="roomRules"
              label="Enter the room"
              required
            />
            <v-btn
              :disabled="!isValid"
              :loading="submitting"
              color="primary"
              class="mt-3"
              type="submit"
            >
              Submit
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import messageDict from '~/lib/messageDict'
import { MAX_NAME_LEN, MAX_ROOM_LEN, SNACKBAR_TIMEOUT_MS } from '~~/shared/constants'
import { useChatStore } from '~/stores/chat'

definePageMeta({ layout: 'login' })
useHead({ title: 'nuxt-chat-app' })

const router = useRouter()
const route = useRoute()
const store = useChatStore()

const form = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const isValid = ref(true)
const user = reactive({
  name: '',
  room: '',
  typingStatus: false,
})

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length <= MAX_NAME_LEN) || `Name must be ${MAX_NAME_LEN} characters or fewer`,
]
const roomRules = [
  (v: string) => !!v || 'Enter the room',
  (v: string) => (v && v.length <= MAX_ROOM_LEN) || `Room must be ${MAX_ROOM_LEN} characters or fewer`,
]

const initialMessage = (() => {
  const key = route.query.message
  return (typeof key === 'string' && messageDict[key]) || ''
})()

const snackbar = ref(Boolean(initialMessage))
const snackbarText = ref(initialMessage)
const snackbarColor = ref<string | undefined>(undefined)
const submitting = ref(false)

function showError(text: string) {
  snackbarText.value = text
  snackbarColor.value = 'error'
  snackbar.value = true
}

async function submit() {
  if (!form.value || submitting.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  submitting.value = true
  try {
    await store.createUser({ ...user })
    router.push('/chat')
  } catch {
    showError("Couldn't reach the server. Try again.")
  } finally {
    submitting.value = false
  }
}
</script>
