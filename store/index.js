export const state = () => ({
  user: {},
  messages: [],
  users: [],
  waitingUsers: null,
  cards: [],
  cardsChosen: [],
  cardsWon: []
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setGame(state, game) {
    state.cards = game.cards;
    state.cardsChosen = game.cardsChosen;
    state.cardsWon = game.cardsWon;
  },
  setCardsChosen(state, cards) {
    state.cardsChosen = cards;
  },
  setWaitingUsers(state, waitingUsers) {
    state.waitingUsers = waitingUsers;
  },
  newMessage(state, msg) {
    state.messages = [...state.messages, msg];
  },
  updateUsers(state, users) {
    state.users = users;
  },
  clearData(state) {
    state.user = {};
    state.messages = [];
    state.users = [];
  }
};
