<template>
  <v-container>
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      {{ message }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-col cols="12">
        <v-chip
          v-for="(user, index) in users"
          :key="`user-chips-${index}`"
          :color="user.hasTurn ? 'green' : 'grey'"
          >{{ user.name }} {{ user.score }}</v-chip
        >
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h1>Memory</h1>
            <v-btn v-on:click="createGame()">Neues Spiel!</v-btn>
          </v-card-title>
          <v-card-subtitle
            >ID: {{ user.id }} --- Ist am Zug: {{ hasTurn }}</v-card-subtitle
          >
        </v-card>
        <!--
        <Message
          v-for="(message, index) in messages"
          :key="`message-${index}`"
          :name="message.name"
          :text="message.text"
          :time="message.time"
          :owner="message.id === user.id"
        />-->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(card, index) in cards"
                :key="`card-${index}`"
                class="d-flex child-flex"
                cols="3"
              >
                <v-card flat tile class="d-flex">
                  <v-img
                    :src="card.img"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    v-on:click="flipCard(card)"
                    :class="card.found ? 'found' : ''"
                  >
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Message from "@/components/Message";
// import { Memory } from "@/utils/memory.js";

//const Memory = require("@/utils/memory");

export default {
  name: "memory",
  layout: "default",
  head: {
    title: "Nuxt-chat-memory"
  },
  components: {
    Message
  },
  data() {
    return {
      snackbar: false,
      message: ""
    };
  },
  computed: {
    ...mapState([
      "user",
      "users",
      "hasTurnUserId",
      "cards",
      "cardsChosen",
      "messages"
    ]),
    hasTurn() {
      return this.user.hasTurn;
    }
  },
  mounted() {},

  methods: {
    ...mapMutations(["nextUser"]),
    createGame() {
      console.log("los geklickt");
      /*
      this.Memory = new Memory(grid, result);
      this.Memory.createBoard();
      */
      this.$socket.emit("createGame", this.user, 6);
      //createBoard(grid);
    },
    flipCard(card) {
      if (!this.hasTurn) {
        this.message = "Du bist nicht dran";
        this.snackbar = true;
        return;
      }
      console.log(card);
      if (this.cardsChosen.length < 2) {
        this.$socket.emit("flipCard", this.user, card, data => {
          console.log("callback flipcard");
          if (this.cardsChosen.length === 2) {
            console.log("time to check for a match");
            setTimeout(() => {
              this.$socket.emit("checkForMatch", this.user);
            }, 500);
          }
        });
      }
    }
  }
};
</script>

<style>
.grid {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  width: 400px;
}

.grid img {
  height: 100px;
  width: 100px;
}

.found {
  filter: brightness(50%);
}
</style>
