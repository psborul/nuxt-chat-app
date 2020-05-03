<template>
  <v-app style="background: #303030">
    <v-navigation-drawer
      app
      v-model="drawer"
      mobile-break-point="650"
      color="$accent"
    >
      <v-list subheader>
        <v-subheader>Users in room</v-subheader>

        <v-list-item
          v-for="(u, index) in users"
          :key="`user-${index}`"
          @click.prevent
        >
          <v-list-item-content>
            <v-list-item-title v-text="u.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon :color="u.id === user.id ? 'primary' : 'grey'">mdi-account-circle-outline</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#424242"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        Room
        <v-chip color="grey">{{ user.room }}</v-chip>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        class="mx-1"
        @click="exit"
      >
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
        style="height: 100%"
      >
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

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
    typing(user) {
      this.addTypingUser(user)
    },
    setTypingStatus(user) {
      this.displayTypingStatus(user);
    }
  },
  computed: {
    ...mapState(["user", "users"])
  },
  middleware: "auth",
  methods: {
    ...mapMutations(["updateUsers", "newMessage"]),
    ...mapActions(["socketEmit", "joinRoom", "leftRoom", "addTypingUser", "displayTypingStatus"]),
    exit() {
      this.leftRoom();
      this.$router.push("/?message=leftChat");
    }
  },
  created() {
    this.joinRoom(this.user);
  }
};
</script>
