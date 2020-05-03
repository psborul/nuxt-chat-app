export const state = () => ({
  user: {},
  messages: [],
  users: [],
})

export const getters = {
  typingUsers: state => state.users.filter(user => user.status)
}

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  updateTypingUsers(state, user) {
    state.typingUsers = [...state.typingUsers, user];
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
  },
  setTypingStatus(state, user) {
    const { users } = state;
    const { status, id } = user;
    const userIndex = users.findIndex(u => u.id === id);
    users[userIndex].status = status;
  }
}

export const actions = {
  socketEmit({ commit }, { action, payload }) {
    this._vm.$socket.emit(action, payload, data => {
      // console.log(data);
    })
  },
  createMessage({ commit, dispatch, state }, msg) {
    const { user } = state;
    const payload = {
      msg,
      id: user.id
    };

    dispatch('socketEmit', {
      action: 'createMessage',
      payload
    });
  },
  joinRoom({ commit, dispatch, state }) {
    const { user } = state;

    dispatch('socketEmit', {
      action: 'joinRoom',
      payload: user
    });
  },
  leftRoom({ commit, dispatch, state }) {
    dispatch('socketEmit', {
      action: 'leftChat',
      payload: null
    });

    commit('clearData');
  },
  typing({ commit, dispatch, state }) {
    const { user } = state;
    dispatch('socketEmit', {
      action: 'typing',
      payload: user
    });
  },
  addTypingUser({ commit, dispatch, state }, user) {
    if (!state.typingUsers.some(el => el.id === user.id)) {
      commit('updateTypingUsers', user);
    }
  },
  setTypingStatus({ commit, dispatch, state }, status) {
    const { user } = state;
    const newUser = { ...user, status}
    dispatch('socketEmit', {
      action: 'setTypingStatus',
      payload: newUser
    });
  },
  displayTypingStatus({ commit }, user) {
    commit('setTypingStatus', user)
  }
}