<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" mobile-break-point="650">
      <v-list subheader>
        <v-subheader>Users in room</v-subheader>

        <v-list-item v-for="(u, index) in users" :key="`user-${index}`" @click.prevent>
          <v-list-item-content>
            <v-list-item-title v-text="u.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon :color="u.id === user.id ? 'primary' : 'grey'">mdi-account-circle-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        Room
        <v-chip color="grey">{{ user.room }}</v-chip>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="mx-1" @click="exit">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid style="height: 100%">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    drawer: true
  }),
  sockets: {
    updateUsers(users) {
      this.updateUsers(users);
    },
    newMessage(msg) {
      this.newMessage(msg);
    },
  },
  computed: {
    ...mapState(["user", "users"])
  },
  middleware: "auth",
  methods: {
    ...mapMutations(["clearData", "updateUsers", "newMessage"]),
    exit() {
      this.$socket.emit("leftChat", () => {
        this.$router.push("/?message=leftChat");
        this.clearData();
      });
    }
  },
  created() {
    this.$socket.emit("joinRoom", this.user)
  }
};
</script>
