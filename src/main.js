import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import Axios from 'axios'

const instance = Axios.create({
  baseURL: 'http://localhost:9020',
  timeout: 1000,
  headers: {'Accept': 'application/json'}
});

Vue.prototype.$http = instance;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify,
  components: { App },
  template: '<App/>'
}).$mount('#app')
