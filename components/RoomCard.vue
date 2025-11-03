<template>
  <div class="room-card" :class="{ private: room.isPrivate }">
    <div class="room-card__header">
      <span class="room-card__name">{{ room.name }}</span>
      <span v-if="room.isPrivate" class="room-card__private">Private</span>
    </div>

    <div class="room-card__meta">
      <div>ID: {{ room.id }}</div>
      <div>Users: {{ room.users.length }}</div>
      <div>Created: {{ formatDate(room.createdAt) }}</div>
      <div>Owner: {{ room.createdBy }}</div>
    </div>

    <div class="room-card__actions">
      <Button
        v-if="!room.joined && !owned"
        variant="primary"
        @click="$emit('join', { roomId: room.id, createdBy: room.createdBy })"
      >
        Join
      </Button>

      <Button
        v-if="!owned"
        variant="secondary"
        @click="$emit('leave', { roomId: room.id, createdBy: room.createdBy })"
      >
        Leave
      </Button>

      <Button
        v-if="owned"
        variant="primary"
        @click="$emit('openChat', room.id)"
      >
        Open Chat
      </Button>

      <Button
        v-if="owned"
        variant="danger"
        @click="$emit('delete', room.id)"
      >
        Remove
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '~/types';

defineProps<{ room: Room, owned: boolean }>();
defineEmits(['join', 'leave', 'delete', 'openChat']);

//TODO: replace to utils
function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped lang="scss">
.room-card {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: var(--shadow);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    background-color: var(--surface-hover);
  }

  &__header {
    font-weight: 600;
    font-size: 18px;
    color: var(--color-primary);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__private {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: var(--color-error);
    color: var(--text-on-primary);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 14px;
    color: var(--muted);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;

    button {
      flex: 1 1 calc(50% - 6px);
      min-width: 120px;
    }
  }

  &.private .room-card__header {
    color: var(--color-error);
  }
}
</style>
