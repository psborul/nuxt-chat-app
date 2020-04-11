export const state = () => ({
  user: {},
  messages: [],
  users: [],
  cards: [],
  cardsChosen: []
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setCards(state, cards) {
    state.cards = cards;
  },
  setCardsChosen(state, cards) {
    state.cardsChosen = cards;
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
