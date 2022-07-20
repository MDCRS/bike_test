import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import global from './globalFun'
import request from "./axios";
import axios from "axios";
Vue.prototype.$axios = request
Vue.config.productionTip = false
Vue.use(ElementUI);


// require('./mock')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
