<template>
  <div class="rooms-page">
    <header class="rooms-header">
      <h1 class="greeting">Hello, {{ user?.username }}</h1>
      <Button type="primary" class="logout-btn" @click="handleLogout">
        Log out
      </Button>
    </header>

    <RoomsComponent
      class="rooms-table"
      :rooms="rooms"
      @join="handleJoin"
      @delete="handleDelete"
      @open-chat="handleOpenChat"
      @leave="handleLeave"
    />

    <form class="rooms-form" @submit.prevent="handleCreateRoom">
      <Textfield
        v-model="roomName"
        placeholder="Enter new room name"
        class="room-name-input"
        required
      />
      <Button type="secondary" class="create-btn" :disabled="!roomName.trim()">
        Create Room
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import NetworkService from "~/services/NetworkService";
import Storage from "~/services/Storage";
import type { Room } from "~/types";

const router = useRouter();

const user = ref();
const roomName = ref("");
const rooms = ref<Room[]>([]);

onMounted(() => {
  user.value = Storage.get(STORAGE_USER_KEY);
  getRooms();
});

const getRooms = async () => {
  if (!user.value?.id) return;
  rooms.value = await NetworkService.get(`/api/rooms?userId=${user.value.id}`);
};

const handleOpenChat = (roomId: string) => {
  Storage.set(STORAGE_USER_KEY, { ...user.value, roomId });
  router.push({ name: ROUTE.CHAT });
};

const handleLogout = () => {
  Storage.remove(STORAGE_USER_KEY);
  router.push({ name: ROUTE.LOGIN });
};

const handleCreateRoom = async () => {
  if (!roomName.value.trim()) return;
  await NetworkService.post("/api/rooms", {
    name: roomName.value.trim(),
    userId: user.value.id,
  });
  roomName.value = "";
  getRooms();
};

const handleDelete = async (roomId: string) => {
  await NetworkService.post("/api/rooms/delete", {
    userId: user.value.id,
    roomId,
  });
  getRooms();
};

const handleLeave = async ({ roomId }: { roomId: string }) => {
  await NetworkService.post("/api/rooms/leave", {
    userId: user.value.id,
    roomId,
  });
  getRooms();
};

const handleJoin = async ({
  roomId,
  createdBy,
}: {
  roomId: string;
  createdBy: string;
}) => {
  if (user.value.id !== createdBy) {
    await NetworkService.post("/api/rooms/join", {
      userId: user.value.id,
      roomId,
    });
  }
  getRooms();
};

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped>
.rooms-page {
  background: #f5f7fa;
  color: #222;
  max-width: 900px;
  max-height: 100vh;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: "Roboto", sans-serif;
  padding-top: 80px; /* to offset fixed header */
}

.rooms-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  z-index: 1000;
}

.greeting {
  font-weight: 600;
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.logout-btn {
  padding: 8px 20px;
  font-weight: 600;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.logout-btn:hover {
  background-color: #1565c0;
}

.rooms-table {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.12);
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb #f5f7fa;
}

.rooms-table::-webkit-scrollbar {
  width: 8px;
}

.rooms-table::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.rooms-form {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
}

.room-name-input {
  flex: 1 1 auto;
}

.create-btn {
  min-width: 120px;
  font-weight: 600;
  cursor: pointer;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  transition: background-color 0.25s ease;
}

.create-btn:hover:not(:disabled) {
  background-color: #1565c0;
}

button[type="secondary"] {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  color: #333;
  padding: 10px 20px;
  border-radius: 6px;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

button[type="secondary"]:hover:not(:disabled) {
  background-color: #d5d5d5;
  border-color: #bbb;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
