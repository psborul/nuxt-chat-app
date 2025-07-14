<template>
  <div class="chat-page">
    <aside class="sidebar">
      <p>Users in room:</p>
      <ul>
        <li v-for="userItem in users" :key="userItem.id">
          {{ userItem.username }}
        </li>
      </ul>
    </aside>
    <main class="chat-page__main">
      <header class="header">
        Room: {{ roomId }}
        <Button type="primary" @click.prevent="handleLeave">LEAVE</Button>
      </header>
      <div class="message-window">
        <div class="message-view">
          <MessageItem
            v-for="message in messages"
            :id="message.id"
            :key="message.id"
            :content="message.content"
            :created-at="message.createdAt"
            :self="message.userId === user?.id"
            :type="message.type || ''"
          />
        </div>

        <form class="form" @submit.prevent="handleSubmit">
          <Textfield v-model="text" class="form__input" />
          <Button type="primary" class="form__button">Submit</Button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import MessageItem from "~/components/MessageItem.vue";
import NetworkService from "~/services/NetworkService";
import SocketService, {
  SOCKET_EVENT_TYPE,
} from "~/services/SocketService";
import Storage from "~/services/Storage";
import type { Message, User } from "~/types";

const router = useRouter();
const { params } = useRoute();

const roomId = params.id as string;

const text = ref<string>("");
const user = ref<User>();
const users = ref<User[]>();
const messages = ref<Message[]>([]);

const fetchUsers = async () => {
  users.value = await NetworkService.get(
    `/api/users?roomId=${roomId}`
  );
};

const fetchMessages = async () => {
  messages.value = await NetworkService.get(
    `/api/messages?roomId=${roomId}`
  );
};

let socketService: SocketService;

onMounted(async () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  const socketUrl = `${protocol}://${host}/ws/socket`;

  socketService = new SocketService(socketUrl);

  user.value = Storage.get<User>(STORAGE_USER_KEY);

  fetchMessages();
  fetchUsers();

  socketService.connect();

  socketService.emitter.$on(SOCKET_EVENT_TYPE.OPEN, () => {
    if (!user.value) return;
    socketService.joinRoom({
      userId: user.value.id,
      roomId: roomId,
    });
  });

  socketService.emitter.$on(SOCKET_EVENT_TYPE.MESSAGE, async (data) => {
    if (!user.value) return;
    messages.value.push(data);
  });

  window.addEventListener("beforeunload", () => handleLeave);
});

const handleLeave = () => {
  if (!user.value) return;
  socketService.leaveRoom({
    roomId: roomId,
    userId: user.value.id,
  });
  router.push({ name: ROUTE.ROOMS });
};

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", () => handleLeave);
  socketService.disconnect();
});

const handleSubmit = () => {
  socketService.sendMessage({
    userId: user.value?.id,
    message: text.value,
    roomId: roomId,
  });
  text.value = "";
};

definePageMeta({
  middleware: "auth",
});
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  height: 100vh;
  background-color: var(--bg);
  color: var(--text);

  &__main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.sidebar {
  background-color: var(--surface-hover);
  color: var(--text);
  padding: 10px;
  border-right: 1px solid var(--border);
  min-width: 180px;
}

.header {
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  background-color: var(--surface);
  color: var(--text);
  border-bottom: 1px solid var(--border);
}

.message-window {
  width: 100%;
  padding: 20px;
  height: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 18px;
  font-style: italic;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message-view {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
}

.form {
  display: flex;
  align-items: end;
  width: 100%;

  &__button {
    margin-left: 5px;
  }

  &__input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .chat-page {
    flex-direction: column;
  }

  .sidebar {
    order: 2;
    border-right: none;
    border-top: 1px solid var(--border);
  }
}
</style>
