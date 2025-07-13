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
        Room: {{ user?.roomId }}
        <Button type="primary" @click.prevent="handleLeave">LEAVE</Button>
      </header>
      <div class="message-window">
        <div class="message-view">
          <MessageItem
v-for="message in messages" :id="message.id" :key="message.id" :content="message.content"
            :created-at="message.createdAt" :self="message.userId === user?.id" :type="message.type" />
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

const text = ref<string>("");
const user = ref<User>();
const users = ref<User[]>();
const messages = ref<Message[]>([]);

const fetchUsers = async () => {
  users.value = await NetworkService.get(
    `/api/users?roomId=${user?.value?.roomId}`
  );
};

const fetchMessages = async () => {
  messages.value = await NetworkService.get(
    `/api/messages?roomId=${user?.value?.roomId}`
  );
};

let socketService: SocketService;

onMounted(async () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host; // e.g., localhost:3000 or myapp.vercel.app
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
      roomId: user.value.roomId,
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
    roomId: user.value.roomId,
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
    roomId: user.value?.roomId,
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

  &__main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}

.sidebar {
  background-color: #3a3a3a;
  color: #fff;
  padding: 10px;
}

.header {
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  background-color: #252934;
  color: #fff;
}

.message-window {
  width: 100%;
  padding: 20px;
  height: 100%;
  background: #424242;
  border: 1px solid #2e2e2e;
  color: white;
  font-size: 18px;
  font-style: italic;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.message-view {
  display: flex;
  flex-direction: column;
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
</style>