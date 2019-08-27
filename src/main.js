import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import Axios from 'axios'
import moment from 'moment'

const httpInstance = Axios.create({
  baseURL: 'http://localhost:9020',
  headers: {'Accept': 'application/json'}
});

Vue.prototype.$http = httpInstance;
Vue.config.productionTip = false
Vue.prototype.$log = console;

new Vue({
  render: h => h(App),
  router,
  vuetify,
  components: { App },
  template: '<App/>'
}).$mount('#app')

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MMMM Do YYYY, h:mm a');
  }
});
