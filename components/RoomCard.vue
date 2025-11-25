<template>
  <div class="room-card" :class="{ private: room.isPrivate }">
    <div class="room-card__header">
      <span class="room-card__name">{{ room.name }}</span>
      <span v-if="room.isPrivate" class="room-card__private">Private</span>
    </div>

    <div class="room-card__meta">
      <div>{{ room.users.length }} member{{ room.users.length !== 1 ? 's' : '' }}</div>
      <div>{{ onlineCount }} online</div>
      <div>Created {{ formatDate(room.createdAt) }}</div>
      <div v-if="room.joined" class="joined-indicator">✓ Joined</div>
    </div>

    <div class="room-card__actions">
      <!-- Join button for non-members -->
      <Button
        v-if="!room.joined && !owned"
        variant="primary"
        @click="$emit('join', { roomId: room.id, createdBy: room.createdBy })"
      >
        Join
      </Button>

      <!-- Open chat button for members -->
      <Button
        v-if="room.joined && !owned"
        variant="primary"
        @click="$emit('openChat', room.id)"
      >
        Open Chat
      </Button>

      <!-- Leave button for members (non-owners) -->
      <Button
        v-if="room.joined && !owned"
        variant="secondary"
        @click="$emit('leave', { roomId: room.id, createdBy: room.createdBy })"
      >
        Leave
      </Button>

      <!-- Owner buttons -->
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
        Delete Room
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '~/types';
import { formatDate } from '~/utils/date';

const props = defineProps<{ room: Room, owned: boolean }>();
defineEmits(['join', 'leave', 'delete', 'openChat']);

// Computed properties
const onlineCount = computed(() => {
  return props.room.users?.filter(user => user.online).length || 0;
});
</script>

<style scoped lang="scss">
.room-card {
  background-color: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    background-color: var(--surface-hover);
    border-color: var(--color-primary);
  }

  &__header {
    font-weight: 700;
    font-size: var(--text-lg);
    color: var(--text);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__private {
    font-size: var(--text-xs);
    font-weight: 600;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-warning);
    color: var(--text);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    font-size: var(--text-sm);
    color: var(--text-muted);

    .joined-indicator {
      color: var(--color-success);
      font-weight: 600;
      background-color: color-mix(in srgb, var(--color-success) 15%, transparent);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);

    button {
      flex: 1 1 calc(50% - var(--spacing-sm));
      min-width: 120px;
    }
  }

  &.private .room-card__header {
    color: var(--color-error);
  }
}
</style>
