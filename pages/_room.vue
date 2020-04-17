<template>
  <v-container fluid>
    <v-banner app sticky color="grey darken-2" elevation="5">
      <v-row no-gutters>
        <v-col>
          <v-badge
            v-for="(userInRoom, index) in users"
            :key="`user-chips-${index}`"
            bottom
            overlap
            class="mx-2"
            color="orange"
            :content="userInRoom.score"
          >
            <v-chip
              :color="userInRoom.hasTurn ? 'green' : 'grey'"
              :close="user.isCreator && !userInRoom.isCreator"
              close-icon="mdi-delete"
              @click:close="kickUser(userInRoom)"
              ><v-icon v-if="userInRoom.isCreator" left>mdi-star</v-icon>
              {{ userInRoom.name }}</v-chip
            ></v-badge
          ></v-col
        >
        <!-- Karten pro Zeile: {{ cardsPerRow }} Spielfeldgröße:
        {{ window.boardSize }} -->
      </v-row>
    </v-banner>
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      {{ message }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <!-- <h1>Terminal</h1>
    <Message
      v-for="(message, index) in messages"
      :key="`message-${index}`"
      :name="message.name"
      :text="message.text"
      :time="message.time"
      :owner="message.id === user.id"
    /> -->
    <v-row v-if="user.isCreator" justify="center">
      <v-col cols="auto">
        <v-card color="grey darken-2">
          <div v-if="!singlePlayer">
            <!-- <v-card-subtitle v-if="user.hasTurn">Du bist dran!</v-card-subtitle>
            <v-card-subtitle v-else>Du bist nicht dran.</v-card-subtitle> -->
          </div>
          <v-card-text>
            <v-container>
              <v-row no-gutters justify="center">
                <v-col cols="auto">
                  <v-row>
                    <v-col class="text-center pb-1"
                      ><h3 class="white--text">Anzahl Pärchen</h3></v-col
                    >
                  </v-row>
                  <v-row justify="center">
                    <v-col cols="auto" class="pr-1 pt-1">
                      <v-btn
                        icon
                        class="primary"
                        :disabled="singlePlayer && gameRunning"
                        @click="pairIndex > 0 ? pairIndex-- : pairIndex"
                        ><v-icon>mdi-chevron-left</v-icon></v-btn
                      >
                    </v-col>
                    <v-col cols="auto" class="px-1 pt-1">
                      <v-chip class="px-4 mx-1 mt-1 primary">
                        <strong>{{ pairs[pairIndex] }}</strong>
                      </v-chip>
                    </v-col>
                    <v-col cols="auto" class="pl-1 pt-1">
                      <v-btn
                        icon
                        class="primary"
                        :disabled="singlePlayer && gameRunning"
                        @click="
                          pairIndex < pairs.length - 1 ? pairIndex++ : pairIndex
                        "
                        ><v-icon>mdi-chevron-right</v-icon></v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row v-if="singlePlayer && currentRecord">
                    <v-col cols="auto">
                      <h3>
                        Einzelspieler Rekord für {{ pairs[pairIndex] }} Pärchen
                      </h3>
                      Züge:
                      {{ currentRecord.turns }} | Zeit:
                      {{ formatRecordTime(currentRecord.timeMs) }}
                    </v-col>

                    <v-col cols="auto">
                      <h3>Deine Leistung:</h3>
                      Züge: {{ turns }} | Zeit:
                      {{ formatRecordTime(time) }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
            <v-btn class="my-1" block color="primary" v-on:click="createGame()"
              >Neues Spiel</v-btn
            >
            <v-btn
              v-if="cardsLeft"
              class="my-1"
              block
              color="orange"
              v-on:click="endGame()"
              >Spiel beenden</v-btn
            >

            <v-btn
              class="my-1"
              block
              color="teal"
              v-clipboard:copy="link"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              Freunde einladen
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-container>
      <v-row no-gutters>
        <v-col xl="4" lg="6" md="8" sm="10" xs="12">
          <v-card light class="pa-2" outlined tile>
            breakpoint: {{ breakpoint.px }} {{ breakpoint.text }}
          </v-card>
        </v-col>
      </v-row>
    </v-container> -->
    <v-row no-gutters justify="center" :class="!user.isCreator ? 'mt-3' : ''">
      <v-col cols="12" md="11" lg="10" align="center">
        <v-card
          v-if="cards.length"
          color="grey darken-2"
          v-bind:style="{
            justify: 'center',
            width: window.boardSize + 'px'
          }"
        >
          <!-- <v-container fluid> -->
          <v-row ref="Row" no-gutters>
            <v-col
              v-for="(card, index) in cards"
              :key="`card-${index}`"
              class="d-flex justify-center pa-1"
            >
              <v-btn
                class="pa-0"
                :height="cardSize.size"
                :width="cardSize.size"
                :disabled="!card.img.includes('cardBack')"
                :elevation="!card.img.includes('cardBack') ? '24' : '0'"
                v-on:click="waitingUsers > 0 ? waitForUsers() : flipCard(card)"
              >
                <v-img
                  :src="card.img"
                  aspect-ratio="1"
                  :class="card.found ? 'found' : 'playBoard-card'"
                  alt="Wird geladen..."
                >
                </v-img>
              </v-btn>
            </v-col>
          </v-row>
          <!-- </v-container> -->
        </v-card>
        <v-card v-else>
          <v-card-text>Noch kein Spiel gestartet...</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Message from "@/components/Message";
//database stuff
import gql from "graphql-tag";
import record from "@/apollo/queries/fetchRecord";
import setRecord from "@/apollo/queries/setRecord";

var moment = require("moment");
moment.locale("de");

const NOTIFY_NEW_RECORD = gql`
  subscription notifyNewRecord {
    memoryRecords {
      id
      turns
      timeMs
      pairNumber
    }
  }
`;
// import { Memory } from "@/utils/memory.js";

//const Memory = require("@/utils/memory");

export default {
  name: "memory",
  layout: "default",
  head: {
    title: "Spielzimmer"
  },
  apollo: {
    memoryRecords: {
      prefetch: true,
      query: record
    }
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
      pairIndex: 0,
      pairs: [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 17, 18, 19, 20],
      gameRunning: false,
      timeInterval: null,
      timeStart: null,
      time: 0,
      turns: 0,
      window: {
        width: 0,
        boardSize: 500,
        height: 0
      },
      cardsPerRow: 0,
      breakpoint: {
        px: 0,
        text: ""
      }
    };
  },
  computed: {
    ...mapState([
      "user",
      "users",
      "waitingUsers",
      "cards",
      "cardsChosen",
      "cardsWon",
      "messages"
    ]),
    cardsLeft() {
      const cardsLeft = this.cards.length - this.cardsWon.length;
      console.log("cardWon", this.cardsWon);
      cardsLeft === 0 ? (this.gameRunning = false) : "";
      return cardsLeft;
    },
    singlePlayer() {
      if (this.users.length === 1) {
        return true;
      } else {
        return false;
      }
    },
    currentRecord() {
      if (this.memoryRecords) {
        return this.memoryRecords.find(
          record => record.pairNumber === this.pairs[this.pairIndex]
        );
      }
      return null;
    },
    cardSize() {
      const padding = 8;
      var minSize = 48;
      const maxSize = 400;
      var size = 200;
      var rowWidth = this.window.boardSize;
      //breakpoint
      if (this.breakpoint.text === "lg") {
        rowWidth = ((this.breakpoint.px - 24) * 10) / 12;
        minSize = minSize * 2.5;
      } else if (this.breakpoint.text === "md") {
        rowWidth = ((this.breakpoint.px - 24) * 11) / 12;
        minSize = minSize * 2;
      } else if (this.breakpoint.text === "sm") {
        //rowWidth = ((this.breakpoint.px - 24) * 10) / 12;
        minSize = minSize * 1.5;
      }

      if (this.cards.length) {
        const cardNumber = this.cards.length;

        var minNumber = rowWidth / (maxSize + padding);
        var maxNumber = rowWidth / (minSize + padding);

        // if (minNumber > cardNumber) {
        //   size = maxSize;
        // } else {
        size = Math.trunc(cardNumber / rowWidth);
        while (size < minSize) {
          //} || size > maxSize) {
          size++; //size < minSize ? size++ : size--;
        }
        // }
        var cardsPerRow = Math.trunc(rowWidth / (size + padding));
        while (cardNumber % cardsPerRow !== 0) {
          size++;
          cardsPerRow = Math.trunc(rowWidth / (size + padding));
        }
        this.cardsPerRow = cardsPerRow;
      }
      size > maxSize ? (size = maxSize) : (size = Math.trunc(size));
      return { min: minSize, size: size, max: maxSize };
    }
  },
  mounted() {
    console.log(this.memoryRecords);
  },
  created() {
    //this.link = "http://localhost:3000/invite/" + this.room; //dev
    this.link = "https://memory-spiel.herokuapp.com/invite/" + this.room;
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapMutations(["nextUser"]),
    handleResize() {
      this.window.height = window.innerHeight;
      const minWidth =
        window.innerWidth && document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
            document.documentElement.clientWidth ||
            document.getElementsByTagName("body")[0].clientWidth;
      const maxWidth =
        window.innerWidth && document.documentElement.clientWidth
          ? Math.max(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
            document.documentElement.clientWidth ||
            document.getElementsByTagName("body")[0].clientWidth;
      this.window.boardSize = minWidth - 24;
      // Extra small	xs	< 600px
      // Small	      sm	600px > < 960px
      // Medium	      md	960px > < 1264px*
      // Large	      lg	1264px* > < 1904px*
      // Extra large	xl	> 1904px*
      var text = "";
      if (maxWidth < 600) {
        text = "xs";
      } else if (maxWidth < 960) {
        text = "sm";
      } else if (maxWidth < 1264) {
        text = "md";
      } else if (maxWidth < 1904) {
        text = "lg";
      } else {
        text = "xl";
      }
      this.breakpoint.px = maxWidth;
      this.breakpoint.text = text;
    },
    createGame() {
      console.log("los geklickt");
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      this.time = "00:00.000";
      this.timeStart = null;
      this.turns = 0;
      this.gameRunning = true;
      this.$socket.emit("newGame", this.user, this.pairs[this.pairIndex]);
    },
    endGame() {
      console.log("end geklickt");
      clearInterval(this.timeInterval);
      this.timeInterval = null;
      this.time = "00:00.000";
      this.timeStart = null;
      this.turns = 0;
      this.gameRunning = false;
      //this.$socket.emit("createGame", this.user, this.pairs[this.pairIndex]);
    },
    waitingForUsers() {
      this.message = "Warten auf andere Mitspieler";
      this.snackbar = true;
    },
    flipCard(card) {
      if (!this.user.hasTurn) {
        this.message = "Du bist nicht dran";
        this.snackbar = true;
        return;
      }
      if (!this.timeStart && this.singlePlayer) {
        this.timeStart = moment();
        this.timeInterval = setInterval(() => {
          this.timeRunning();
        }, 10);
      }
      console.log(card);
      if (this.cardsChosen.length < 2) {
        this.$socket.emit("flipCard", this.user, card, data => {
          console.log("callback flipcard");

          if (this.cardsChosen.length === 2) {
            console.log("time to check for a match");
            this.turns++;
            setTimeout(
              () => {
                this.$socket.emit("checkForMatch", this.user, data => {
                  console.log("callback checkforMatch");
                  console.log(this.cardsLeft);
                  if (this.cardsLeft === 0 && this.singlePlayer) {
                    clearInterval(this.timeInterval);
                    if (
                      this.currentRecord &&
                      this.currentRecord.timeMs > this.time
                    ) {
                      this.updateRecord();
                    }
                  }
                });
              },
              this.singlePlayer ? 1 : 1000
            );
          }
        });
      }
    },
    timeRunning() {
      this.time = moment().diff(this.timeStart);
    },
    onCopy: function(e) {
      //alert("You just copied: " + e.text);
      this.message =
        e.text +
        " wurde kopiert. Teile den Link, um Freunde in den Raum einzuladen";
      this.snackbar = true;
    },
    onError: function(e) {
      alert("Failed to copy texts");
    },
    updateRecord() {
      this.message = "Glückwunsch! Neuer Rekord!";
      this.snackbar = true;
      this.$apollo
        .mutate({
          // Query
          mutation: setRecord,
          // Parameters
          variables: {
            pairNumber: this.pairs[this.pairIndex],
            turns: this.turns,
            timeMs: this.time
          }
        })
        .then(data => {
          // Result
          console.log(data);
        })
        .catch(error => {
          // Error
          console.error(error);
          // We restore the initial user input
          // this.newTag = newTag
        });
    },
    formatRecordTime(milliseconds) {
      var displayTime = {
        min: moment.duration(milliseconds).minutes(),
        sec: moment.duration(milliseconds).seconds(),
        ms: moment.duration(milliseconds).milliseconds()
      };
      if (displayTime.ms < 10) {
        displayTime.ms = "00" + displayTime.ms;
      } else if (displayTime.ms < 100) {
        displayTime.ms = "0" + displayTime.ms;
      }
      return `${
        displayTime.min >= 10 ? displayTime.min : "0" + displayTime.min
      }:${displayTime.sec >= 10 ? displayTime.sec : "0" + displayTime.sec}.${
        displayTime.ms
      }`;
    },
    kickUser(user) {
      this.$socket.emit("kickUser", user, data => {
        console.log(data);
      });
    }
  }
};
</script>

<style>
.found {
  filter: brightness(50%);
}

/* .playBoard-card {
  cursor: pointer;
} */

.playBoard-card:hover {
  filter: brightness(125%);
}

.v-banner__content {
  padding-bottom: 8px;
}

.theme--dark.v-list {
  background-color: #3f51b5;
}
</style>
