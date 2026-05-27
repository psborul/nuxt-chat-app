<template>
  <v-list>
    <v-list-subheader>Users in room</v-list-subheader>

    <v-list-item
      v-for="(user, index) in users"
      :key="user.id ?? `user-${index}`"
      :title="user.name"
    >
      <template #append>
        <v-icon
          :icon="mdiAccountCircleOutline"
          :color="user.id === currentUserId ? 'primary' : 'grey'"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { mdiAccountCircleOutline } from '@mdi/js'
import type { ChatUser } from '~/stores/chat'

defineProps<{
  users: ChatUser[]
  currentUserId?: string
}>()
</script>
