<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mobile-breakpoint="650"
      color="accent"
    >
      <v-list>
        <v-list-subheader>Users in room</v-list-subheader>

        <v-list-item
          v-for="({ name, id }, index) in users"
          :key="`user-${index}`"
          :title="name"
        >
          <template #append>
            <v-icon :color="id === user.id ? 'primary' : 'grey'">
              mdi-account-circle-outline
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#424242">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        Room
        <v-chip color="grey">{{ user.room }}</v-chip>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon class="mx-1" @click="exit">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid style="height: 100%">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'

const router = useRouter()
const store = useChatStore()
const { user, users } = storeToRefs(store)

const drawer = ref(true)

onMounted(() => {
  store.joinRoom()
})

function exit() {
  store.leftRoom()
  router.push('/?message=leftChat')
}
</script>
