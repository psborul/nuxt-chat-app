<template>
  <div class="chat-wrapper">
    <div class="chat" ref="chat">
      <Message
        v-for="(message,index) in messages"
        :key="`message-${index}`"
        :name="message.name"
        :text="message.text"
        :time="message.time"
        :owner="message.id === user.id"
      />
    </div>
    <div class="chat__form">
      <ChatForm />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Message from "@/components/Message";
import ChatForm from "@/components/ChatForm";

export default {
  components: {
    Message,
    ChatForm
  },
  head() {
    return {
      title: `Room ${this.user.room}`
    };
  },
  methods: {
    ...mapMutations(["newMessage"])
  },
  computed: {
    ...mapState(["user", "messages"])
  },
  watch: {
    messages() {
      setTimeout(() => {
        if (this.$refs.chat) {
          this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
        }
      }, 0);
    }
  }
};
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.chat__form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
}

.chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
  color: #000;
}
</style>