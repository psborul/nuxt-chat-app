<template>
  <div class="table-container">
    <!-- Header -->
    <div class="grid header">
      <div>Room Name</div>
      <div>Room ID</div>
      <div>Users</div>
      <div>Created</div>
      <div>Private</div>
      <div>Owner</div>
      <div class="actions" colspan="4">Actions</div>
    </div>

    <!-- Room Rows -->
    <div
      v-for="room in rooms"
      :key="room.id"
      class="grid row"
    >
      <div>{{ room.name }}</div>
      <div>{{ room.id }}</div>
      <div>{{ room.users.length }}</div>
      <div>{{ formatDate(room.createdAt) }}</div>
      <div>{{ room.isPrivate ? 'Yes' : 'No' }}</div>
      <div>{{ room.createdBy }}</div>

      <!-- Action Buttons -->
      <div class="action-group">
        <Button
          v-if="!room.joined && !room.isOwner"
          class="btn join"
          @click="$emit('join', { roomId: room.id, createdBy: room.createdBy })"
        >
          Join
        </Button>

        <Button
          v-if="room.joined && !room.isOwner"
          class="btn leave"
          @click="$emit('leave', { roomId: room.id, createdBy: room.createdBy })"
        >
          Leave
        </Button>

        <Button
          v-if="room.joined"
          class="btn open"
          @click="$emit('openChat', room.id)"
        >
          Open Chat
        </Button>

        <Button
          v-if="room.isOwner"
          type="danger"
          @click="$emit('delete', room.id)"
        >
          Remove
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '~/types';

defineProps<{
  rooms: Room[];
}>();

defineEmits(["join", "delete", "openChat", "leave"]);

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.table-container {
  max-width: 100%;
  margin: auto;
  font-size: 14px;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr) minmax(200px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.header {
  background-color: #f5f5f5;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
  border-bottom: 2px solid #ccc;
}

.row {
  background-color: #fafafa;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.btn.join {
  background-color: #1976d2;
  color: white;
}
.btn.join:hover {
  background-color: #1565c0;
}

.btn.leave {
  background-color: #ff9800;
  color: white;
}
.btn.leave:hover {
  background-color: #f57c00;
}

.btn.open {
  background-color: #4caf50;
  color: white;
}
.btn.open:hover {
  background-color: #43a047;
}
</style>
