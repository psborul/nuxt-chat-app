<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="370">
        <v-snackbar v-model="snackbar" :timeout="3000" top>
          {{ message }}
          <v-btn dark text @click="snackbar = false">Close</v-btn>
        </v-snackbar>

        <v-card-title>
          <h1>Login</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="room"
              :rules="roomRules"
              label="Enter the room"
              required
            ></v-text-field>
            <v-btn :disabled="!valid" color="primary" class="mr-4" type="submit">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";

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
    id: null,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 16) || "Name must be less than 16 characters"
    ],
    room: "",
    roomRules: [v => !!v || "Enter the room"],
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
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room,
          id: 0
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