<template>
  <v-container>
    <v-banner app sticky color="grey darken-2" elevation="5">
      <v-badge
        v-for="(user, index) in users"
        :key="`user-chips-${index}`"
        bottom
        overlap
        class="mx-2"
        color="orange"
        :content="user.score"
      >
        <v-chip :color="user.hasTurn ? 'green' : 'grey'">{{
          user.name
        }}</v-chip></v-badge
      >
    </v-banner>
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      {{ message }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-row justify="center">
      <v-col cols="12">
        <v-card color="grey darken-2">
          <v-card-subtitle v-if="hasTurn">Du bist dran!</v-card-subtitle>
          <v-card-subtitle v-else>Du bist nicht dran.</v-card-subtitle>
          <v-card-text>
            <v-select
              v-model="amount"
              :items="cardNumbers"
              label="Anzahl Pärchen"
              solo
              class="mb-n6"
            ></v-select>
            <v-btn
              class="my-1"
              block
              color="primary"
              :disabled="!amount"
              v-on:click="createGame()"
              >Neues Spiel!</v-btn
            >

            <v-btn
              class="my-1"
              block
              color="teal"
              v-clipboard:copy="link"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              Freunde in Spielzimmer einladen
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="cards.length">
      <v-col cols="12">
        <v-card color="grey darken-2">
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(card, index) in cards"
                :key="`card-${index}`"
                class="d-flex child-flex pa-2"
                cols="3"
                :md="2"
                :sm="3"
              >
                <v-card
                  flat
                  tile
                  class="d-flex red"
                  :elevation="!card.img.includes('cardBack') ? '24' : '0'"
                >
                  <v-img
                    :src="card.img"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    v-on:click="
                      !card.img.includes('cardBack') ? '' : flipCard(card)
                    "
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
    title: "Spielzimmer"
  },
  components: {
    Message
  },
  data() {
    return {
      room: this.$route.params.room,
      snackbar: false,
      message: "",
      link: null,
      cardNumbers: [2, 4, 6, 8, 10, 12],
      amount: null
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
  created() {
    //this.link = "http://localhost:3000/invite/" + this.room; //dev
    this.link = "https://memory-spiel.herokuapp.com/invite" + this.room;
  },
  methods: {
    ...mapMutations(["nextUser"]),
    createGame() {
      console.log("los geklickt");

      this.$socket.emit("createGame", this.user, this.amount);
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
            }, 1000);
          }
        });
      }
    },
    onCopy: function(e) {
      //alert("You just copied: " + e.text);
      this.message = e.text + " wurde kopiert";
      this.snackbar = true;
    },
    onError: function(e) {
      alert("Failed to copy texts");
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

.v-banner__content {
  padding-bottom: 8px;
}
</style>
