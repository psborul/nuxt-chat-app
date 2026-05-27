<template>
  <div v-if="users.length" class="typing" aria-live="polite">
    <p
      v-for="(user, index) in users"
      :key="user.id ?? `typing-${index}`"
      class="typing__user"
    >
      {{ user.name }} is typing...
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ChatUser } from '~/stores/chat'

defineProps<{ users: ChatUser[] }>()
</script>

<style scoped>
.typing {
  position: absolute;
  display: flex;
  bottom: 50px;
}

.typing__user:not(:first-child) {
  margin-left: 15px;
}
</style>
