<template>
  <aside class="sidebar">
    <p>Members in room:</p>
    <ul class="user-list">
      <li
        v-for="userItem in users" 
        :key="userItem.id" 
        class="user-item"
        :class="{ self: userItem.id === currentUser?.id }"
      >
        <Avatar 
          :username="userItem.username" 
          size="sm" 
          :online="userItem.online" 
          show-status 
        />
        <span class="username">{{ userItem.username }}</span>
        <span v-if="userItem.id === currentUser?.id" class="you-label">(you)</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { User } from '~/types';

defineProps<{
  users: User[];
  currentUser: User | undefined;
}>();
</script>

<style scoped lang="scss">
.sidebar {
  background-color: var(--surface);
  color: var(--text);
  padding: var(--spacing-md);
  border-right: 2px solid var(--border);
  min-width: 220px;
  max-width: 280px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }

  h3, p {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.user-list {
  margin-top: var(--spacing-sm);
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background-color: var(--surface);
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background-color: var(--surface-hover);
    border-color: var(--border);
  }

  &.self {
    font-weight: 600;
    background-color: color-mix(in srgb, var(--color-primary) 10%, var(--surface));
    border-color: var(--color-primary);
  }


  .username {
    flex: 1;
  }

  .you-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    background-color: var(--surface-variant);
    padding: 2px var(--spacing-xs);
    border-radius: var(--radius-sm);
  }
}
</style>
