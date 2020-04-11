<template>
  <v-app>
    <v-navigation-drawer
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
    </v-navigation-drawer>

    <v-app-bar app color="grey darken-2">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
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
    drawer: false,
  }),
  sockets: {
    updateUsers(users) {
      console.log("default.vue-sockets-updateUsers", users);
      this.updateUsers(users);
      const myUser = users.find((user) => user.id === this.user.id);
      this.setUser(myUser);
    },
    setUser(user) {
      console.log("default.vue-sockets-setUser", user);
      this.setUser(user);
    },
    newMessage(msg) {
      console.log("default.vue-sockets-newMessage", msg);
      this.newMessage(msg);
    },
    setCards(cards) {
      console.log("default.vue-sockets-setCards", cards);
      this.setCards(cards);
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
      /*
      if (result) {
        const user = {
          ...this.user,
          score: this.user.score + 1,
        };
        this.setUser(user);
        var myUsers = JSON.parse(JSON.stringify(this.users));
        console.log("vorher", myUsers);
        myUsers = myUsers.map((myUser) => {
          console.log("in map", myUser);
          if (myUser.id === this.user.id) {
            console.log(myUser.id, this.user.id);
            myUser.score = this.user.score;
            console.log("nach änderung in map", myUser);
            return myUser;
          }
        });
        console.log("nach map", myUsers);
        this.updateUsers(myUsers);
      }*/
      // this.setCards(data.cards);
      this.setCardsChosen(data.cardsChosen);
    },
  },
  computed: {
    ...mapState(["user", "users"]),
  },
  middleware: "auth",
  methods: {
    ...mapMutations([
      "clearData",
      "updateUsers",
      "newMessage",
      "setCards",
      "setCardsChosen",
      "setUser",
    ]),
    exit() {
      this.$socket.emit("leftChat", () => {
        this.$router.push("/?message=leftChat");
        this.clearData();
      });
    },
    giveTurn() {
      console.log("give turn", this.users, this.users.length);
      if (this.hasTurnUserId === 0 && this.users && this.users.length) {
        console.log("give turn in if");
        this.nextUser(this.users[0].id);
      }
    },
  },
  created() {
    this.$socket.emit("joinRoom", this.user);
  },
  mounted() {},
};
</script>
