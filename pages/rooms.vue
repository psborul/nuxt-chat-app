<template>
  <div class="rooms-page">
    <header class="rooms-header">
  <Button
    @click="toggleTheme"
    variant="secondary"
    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
  >
    <span>{{ theme === 'dark' ? '🌙 ' : '☀️ ' }}</span>
    <span class="capitalize">{{ theme }}</span>
  </Button>
      <h1>Hello, {{ user?.username }}</h1>
      <Button variant="primary" @click="handleLogout">Log out</Button>
    </header>

    <!-- Room Creation Form -->
    <form class="rooms-form" @submit.prevent="handleCreateRoom">
      <Textfield
        v-model="roomName"
        placeholder="Enter new room name"
        class="room-name-input"
        required
      />
      <Button variant="secondary">Create Room</Button>
    </form>

    <!-- Room List -->
    <div class="room-list">
      <RoomCard
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        :owned="room.createdBy === user?.id"
        @join="handleJoin"
        @delete="handleDelete"
        @open-chat="handleOpenChat"
        @leave="handleLeave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RoomCard from '~/components/RoomCard.vue';
import RoomService from '~/services/api/RoomService';
import Storage from '~/services/Storage';
import type { Room } from '~/types';

const { theme, toggleTheme } = useTheme()

const router = useRouter();
const user = ref();
const roomName = ref('');
const rooms = ref<Room[]>([]);

onMounted(() => {
  user.value = Storage.get(STORAGE_USER_KEY);
  getRooms();
});

const getRooms = async () => {
  if (!user.value?.id) return;
  rooms.value = await RoomService.getAllByUserId(user.value.id);
};

const handleLogout = () => {
  Storage.remove(STORAGE_USER_KEY);
  router.push({ name: ROUTE.LOGIN });
};

const handleCreateRoom = async () => {
  if (!roomName.value.trim()) return;

  await RoomService.create(roomName.value.trim())

  roomName.value = '';
  getRooms();
};

const handleOpenChat = (roomId: string) => {
  router.push({ name: ROUTE.CHAT, params: { id: roomId } });
};

const handleDelete = async (roomId: string) => {
  await RoomService.delete(roomId)

  getRooms();
};

const handleLeave = async ({ roomId }: { roomId: string }) => {
  await RoomService.leave(roomId)
  getRooms();
};

const handleJoin = async ({ roomId, createdBy }: { roomId: string; createdBy: string }) => {
  if (user.value.id !== createdBy) {
    await RoomService.join(roomId)
  }
  getRooms();
};

definePageMeta({
  middleware: 'auth',
});
</script>

<style scoped lang="scss">
.rooms-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
}

.rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.rooms-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.room-name-input {
  flex: 1 1 250px;
}

.room-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
</style>
