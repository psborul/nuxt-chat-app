<template>
  <v-row
    no-gutters
    align="center"
    justify="center"
  >
    <v-col cols="auto">
      <v-card
        min-width="290"
        color="#424242"
      >
        <v-snackbar
          v-model="snackbar"
          :timeout="3000"
          top
        >
          {{ message }}
          <v-btn
            dark
            text
            @click="snackbar = false"
          >Close</v-btn>
        </v-snackbar>

        <v-card-title>
          <h2>Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="room"
              :counter="16"
              :rules="roomRules"
              label="Enter the room"
              required
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mt-3"
              type="submit"
            >Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  name: "index",
  layout: "login",
  head: {
    title: "Nuxt-chat"
  },
  data: () => ({
    valid: true,
    name: "",
    message: "",
    room: "",
    id: null,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 16) || "Name must be less than 16 characters"
    ],
    roomRules: [
      v => !!v || "Enter the room",
      v => (v && v.length <= 16) || "Room must be less than 16 characters"
    ],
    snackbar: false
  }),
  mounted() {
    const { message } = this.$route.query;
    if (message === "noUser") {
      this.message = "Enter your name and room";
    } else if (message === "leftChat") {
      this.message = "You leaved chat";
    }
    this.snackbar = !!this.message;
  },

  methods: {
    ...mapMutations(["setUser"]),
    ...mapActions(["joinRoom"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room,
          status: false,
        };
        this.$socket.emit("createUser", user, data => {
          user.id = data.id;
          this.setUser(user);
          this.$router.push("/chat");
        });
      }
    }
  }
};
</script>