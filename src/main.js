import Vue from 'vue'
import App from './App.vue'
import store from './store/store.js'
import Antd from 'ant-design-vue'
// import Echarts from 'echarts'
import 'ant-design-vue/dist/antd.less'
import './assets/font/iconfont.css'
import router from './router/router.js'
import '@/assets/utils/filter.js'

Vue.config.productionTip = false
// Vue.prototype.echarts = Echarts
// Vue.use(Echarts)
Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
