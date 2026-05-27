<template>
  <v-row no-gutters align="center" justify="center">
    <v-col cols="auto">
      <VSnackbar v-model="snackbar" :timeout="3000" location="top">
        {{ message }}
        <template #actions>
          <v-btn variant="text" @click="snackbar = false">Close</v-btn>
        </template>
      </VSnackbar>

      <v-card min-width="290" color="#424242">

        <v-card-title>
          <h2>Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid" @submit.prevent="submit">
            <v-text-field
              v-model="user.name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            />
            <v-text-field
              v-model="user.room"
              :counter="16"
              :rules="roomRules"
              label="Enter the room"
              required
            />
            <v-btn
              :disabled="!isValid"
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
import { VSnackbar } from 'vuetify/components/VSnackbar'
import messageDict from '~/lib/messageDict'
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
  (v: string) => (v && v.length <= 16) || 'Name must be less than 16 characters',
]
const roomRules = [
  (v: string) => !!v || 'Enter the room',
  (v: string) => (v && v.length <= 16) || 'Room must be less than 16 characters',
]

const message = computed(() => {
  const key = route.query.message
  return (typeof key === 'string' && messageDict[key]) || ''
})

const snackbar = ref(Boolean(message.value))

async function submit() {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return
  await store.createUser({ ...user })
  router.push('/chat')
}
</script>
