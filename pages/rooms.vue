<template>
  <div class="rooms-page">
    <header class="rooms-header">
      <h1 class="greeting">Hello, {{ user?.username }}</h1>
      <Button type="primary" class="logout-btn" @click="handleLogout">
        Log out
      </Button>
    </header>

    <RoomsComponent
class="rooms-table" :rooms="rooms" @join="handleJoin" @delete="handleDelete"
      @open-chat="handleOpenChat" @leave="handleLeave" />

    <form class="rooms-form" @submit.prevent="handleCreateRoom">
      <Textfield v-model="roomName" placeholder="Enter new room name" class="room-name-input" required />
      <Button type="secondary" class="create-btn">
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
  console.log(roomId)
  router.push({
    name: ROUTE.CHAT, params: {
      id: roomId
    }
  });
};

const handleLogout = () => {
  Storage.remove(STORAGE_USER_KEY);
  router.push({ name: ROUTE.LOGIN });
};

const handleCreateRoom = async () => {
  if (!roomName.value.trim()) return;
  await NetworkService.post("/api/rooms", {
    name: roomName.value.trim(),
  });
  roomName.value = "";
  getRooms();
};

const handleDelete = async (roomId: string) => {
  await NetworkService.post("/api/rooms/delete", {
    roomId,
  });
  getRooms();
};

const handleLeave = async ({ roomId }: { roomId: string; }) => {
  await NetworkService.post("/api/rooms/leave", {
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
      roomId,
    });
  }
  getRooms();
};

definePageMeta({
  middleware: "auth",
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
}

.rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.rooms-table {
  width: 100%;
}

.rooms-form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 1rem;
}

.room-name-input {
  flex: 1 1 250px;
}

.create-btn {
  flex-shrink: 0;
}

.table-container {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow-x: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr) minmax(200px, 1fr);
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.header {
  background-color: var(--surface-hover);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 2px solid var(--border);
}

.row {
  background-color: var(--surface);
}

.row>div {
  word-break: break-word;
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
  color: white;
  transition: background 0.2s ease;
  text-align: center;
}

.btn.join {
  background-color: var(--color-primary);
}

.btn.join:hover {
  background-color: color-mix(in srgb, var(--color-primary) 90%, black);
}

.btn.leave {
  background-color: #ff9800;
}

.btn.leave:hover {
  background-color: #f57c00;
}

.btn.open {
  background-color: #4caf50;
}

.btn.open:hover {
  background-color: #43a047;
}

.btn.danger {
  background-color: var(--color-error);
}

.btn.danger:hover {
  background-color: color-mix(in srgb, var(--color-error) 90%, black);
}

@media (max-width: 768px) {
  .grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
  }

  .header {
    display: none;
  }

  .row {
    padding: 12px;
    border-bottom: 1px solid var(--border);
  }

  .row>div {
    width: 100%;
  }

  .action-group {
    width: 100%;
    justify-content: flex-start;
  }

  .btn {
    flex: 1 1 48%;
  }
}
</style>
