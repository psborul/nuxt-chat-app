<template>
  <v-text-field
    label="Message..."
    outlined
    v-model="msg"
    @click:append="send"
    @keydown.enter="send"
    append-icon="mdi-send-circle-outline"
  />
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    msg: "",
    typingStatus: false
  }),
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["createMessage", "setTypingStatus"]),
    send() {
      if (!this.msg.length) return;
      this.createMessage(this.msg);
      this.msg = "";
    }
  },
  watch: {
    msg(val) {
      if (val) {
        if (!this.typingStatus) {
          this.typingStatus = true;
          this.setTypingStatus(this.typingStatus);
        }
      } else {
        this.typingStatus = false;
        this.setTypingStatus(this.typingStatus);
      }
    }
  }
};
</script>