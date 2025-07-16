<template>
  <aside class="sidebar">
    <p>Members in room:</p>
    <ul class="user-list">
      <li
v-for="userItem in users" :key="userItem.id" class="user-item"
        :class="{ self: userItem.id === currentUser?.id }">
        <span class="status-indicator" :class="{ online: userItem.online, offline: !userItem.online }" />
        <span class="avatar">{{ userItem.username.charAt(0).toUpperCase() }}</span>
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
  background-color: var(--surface-hover);
  color: var(--text);
  padding: 10px;
  border-right: 1px solid var(--border);
  min-width: 180px;

  @media (max-width: 768px) {
    display: none;
  }
}

.user-list {
  margin-top: 10px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--surface);
  transition: background 0.2s;

  &:hover {
    background-color: var(--surface-hover);
  }

  &.self {
    font-weight: 600;
    background-color: var(--user-msg);
  }

  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: var(--text-on-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.online {
      background-color: var(--color-success);
    }

    &.offline {
      background-color: var(--muted);
    }
  }

  .username {
    flex: 1;
  }

  .you-label {
    font-size: 12px;
    color: var(--muted);
  }
}
</style>
