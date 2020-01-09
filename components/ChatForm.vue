<template>
  <v-text-field
    ref="msg"
    label="Message..."
    outlined
    v-model="text"
    @click:append="send"
    @keydown.enter="send"
    append-icon="mdi-send-circle-outline"
  />
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    text: "",
    roomRules: [v => !!v || "Enter the room"]
  }),
  computed: {
    ...mapState(["user"])
  },
  methods: {
    send() {
      if (this.text.length) {
        this.$socket.emit(
          "createMessage",
          {
            text: this.text,
            id: this.user.id
          },
          data => {
            this.text = "";
          }
        );
      }
    }
  }
};
</script>