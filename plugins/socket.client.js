import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import store from '../store';
import io from 'socket.io-client';

const socketInstance = io('/', {
  transports: ['websocket'],
  rejectUnauthorized: false,
});

export default ({ store }) => {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: socketInstance,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  }));
};