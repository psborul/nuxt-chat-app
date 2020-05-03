import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import store from '../store'

export default () => {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: '/',
  }))
}