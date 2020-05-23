import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import store from '../store';

export default ({ store }) => {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: '/',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
  },
  }));
};