<template>
  <v-app>
    <!-- <v-navigation-drawer
      app
      v-model="drawer"
      mobile-break-point="650"
      color="grey darken-2"
    >
      <v-list subheader>
        <v-subheader>Spieler im Raum</v-subheader>

        <v-list-item
          v-for="(u, index) in users"
          :key="`user-${index}`"
          @click.prevent
        >
          <v-list-item-content>
            <v-list-item-title v-text="u.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon :color="u.id === user.id ? 'primary' : 'grey'"
              >mdi-account-circle-outline</v-icon
            >
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>-->

    <v-app-bar app color="grey darken-2">
      <!--<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>-->
      <v-toolbar-title> Memory - Raum: "{{ user.room }}" </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon class="mx-1" @click="exit">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content class="grey darken-3">
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    drawer: false
  }),
  sockets: {
    updateUsers(users) {
      console.log("default.vue-sockets-updateUsers", users);
      this.updateUsers(users);
      const myUser = users.find(user => user.id === this.user.id);
      this.setUser(myUser);
    },
    setUser(user) {
      console.log("default.vue-sockets-setUser", user);
      this.setUser(user);
    },
    waitingUsers(waitingUsers) {
      console.log("default.vue-sockets-setUser", waitingUsers);
      this.setWaitingUsers(waitingUsers);
    },
    newMessage(msg) {
      console.log("default.vue-sockets-newMessage", msg);
      this.newMessage(msg);
    },
    setGame(game) {
      console.log("default.vue-sockets-setGame", game);
      this.setGame(game);
      const thisUser = { ...this.user };
      thisUser.finishedWaiting = true;
      this.$socket.emit("finishedWaiting", thisUser);
    },
    flipCard(cardsChosen) {
      console.log("default.vue-sockets-flipcard", cardsChosen);
      //this.setCards(data.cards);
      this.setCardsChosen(cardsChosen);
    },
    checkForMatch(data) {
      console.log(
        "default.vue-sockets-checkForMatch",
        data.result,
        data.cardsChosen
      );
      this.setCardsChosen(data.cardsChosen);
    },
    gotKicked() {
      console.log("default.vue sockets gotKicked");
      this.exit();
    }
  },
  computed: {
    ...mapState(["user", "users"])
  },
  middleware: "auth",
  methods: {
    ...mapMutations([
      "clearData",
      "updateUsers",
      "newMessage",
      "setGame",
      "setCardsChosen",
      "setUser",
      "setWaitingUsers"
    ]),
    exit() {
      this.$socket.emit("leftChat", () => {
        this.$router.push("/?message=gotKicked");
        this.clearData();
      });
    },
    giveTurn() {
      console.log("give turn", this.users, this.users.length);
      if (this.hasTurnUserId === 0 && this.users && this.users.length) {
        console.log("give turn in if");
        this.nextUser(this.users[0].id);
      }
    }
  },
  created() {
    this.$socket.emit("joinRoom", this.user);
  },
  mounted() {}
};
</script>
