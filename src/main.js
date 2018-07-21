// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import SavingPage from '@/pages/SavingPage'
import VideoTest from '@/pages/VideoTest'

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})


String.prototype.hashCode = function () {
  var hash = 0, i,char;
  if (this.length === 0) return hash;
  for (i=0; i < this.length ; i++) {
    char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}
