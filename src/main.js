import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import Axios from 'axios'

Vue.prototype.$http = Axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  vuetify,
  components: { App },
  template: '<App/>'
}).$mount('#app')
