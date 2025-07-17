<template>
  <div class="chat-page">
    <SidebarMembers :users="users" :current-user="user" />

    <main class="chat-page__main">
      <header class="header">
        <div>
          Room: {{ room?.name }}
          <div class="mobile-user-count">
            {{ users.length }} member{{ users.length !== 1 ? 's,' : ',' }}
            <span class="online-summary">{{ onlineCount }} online</span>
          </div>
        </div>
        <Button variant="primary" @click.prevent="handleLeave">LEAVE</Button>
      </header>

      <div class="message-window">
        <div ref="messageContainer" class="message-view">
          <MessageItem
v-for="message in messages" :id="message.id" :key="message.id" :content="message.content"
            :created-at="message.createdAt" :self="message.userId === user?.id" :type="message.type || ''" />
        </div>

        <form class="form" @submit.prevent="handleSubmit">
          <Textfield ref="inputRef" v-model="text" class="form__input" placeholder="Type a message..." />
          <Button variant="primary" class="form__button">Send</Button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import MessageItem from '~/components/MessageItem.vue';
import type Textfield from '~/components/Textfield.vue';
import MessagesService from '~/services/api/MessagesService';
import RoomService from '~/services/api/RoomService';
import UsersService from '~/services/api/UsersService';
import SocketService, { SOCKET_EVENT_TYPE } from '~/services/SocketService';
import Storage from '~/services/Storage';
import type { Message, User, Room } from '~/types';

const router = useRouter();
const { params } = useRoute();
const roomId = params.id as string;

const text = ref('');
const user = ref<User>();
const users = ref<User[]>([]);
const room = ref<Room>();
const messages = ref<Message[]>([]);

const messageContainer = ref<HTMLElement | null>(null);

const fetchUsers = async () => {
  users.value = await UsersService.getUsers(roomId)
};

const fetchMessages = async () => {
  messages.value = await MessagesService.getMessages(roomId)
};

const fetchRoom = async () => {
  room.value = await RoomService.getById(roomId)
};

const socketUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/socket?token=${Storage.get<User>(STORAGE_USER_KEY).token}`;
const socketService = new SocketService(socketUrl);
socketService.connect();

socketService.emitter.$on(SOCKET_EVENT_TYPE.OPEN, () => {
  socketService.joinRoom({ roomId });
});

socketService.emitter.$on(SOCKET_EVENT_TYPE.MESSAGE, (data) => {
  messages.value.push(data);
  //SCROLL ON NEW MESSAGE
  nextTick(() => {
    messageContainer.value?.scrollTo({ top: messageContainer.value.scrollHeight });
  });
});

onMounted(async () => {
  user.value = Storage.get<User>(STORAGE_USER_KEY);
  
  Promise.allSettled([
  fetchMessages(),
  fetchUsers(),
  fetchRoom()
]);

  window.addEventListener('beforeunload', handleLeave);
});

onBeforeUnmount(() => {
  socketService.disconnect();
  window.removeEventListener('beforeunload', handleLeave);
});

const inputRef = ref<InstanceType<typeof Textfield> | null>(null);

const handleSubmit = () => {
  if (!text.value.trim()) return;

  socketService.sendMessage({ message: text.value, roomId });
  text.value = '';

  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleLeave = () => {
  socketService.leaveRoom({ roomId });
  router.push({ name: ROUTE.ROOMS });
};

const onlineCount = computed(() => users.value.filter(user => user.online).length);

definePageMeta({ middleware: 'auth' });
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  height: 100vh;
  background-color: var(--bg);
  color: var(--text);

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
}

.message-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
}

.message-view {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  scroll-behavior: smooth;
}

.form {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background-color: var(--surface);
  border-top: 1px solid var(--border);

  &__input {
    flex: 1;
  }

  &__button {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .chat-page {
    flex-direction: column;
  }

  .form {
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
}

.mobile-user-count {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;

  @media (min-width: 769px) {
    display: none;
  }
}


.online-summary {
  font-size: 13px;
  color: var(--muted);
  margin-left: 4px;
}
</style>
