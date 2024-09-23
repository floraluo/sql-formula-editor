import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from 'element-ui';

//剪贴板
import VueClipboard from 'vue-clipboard2'
import "element-ui/lib/theme-chalk/index.css";

import { createPinia, PiniaVuePlugin } from "pinia";

Vue.use(VueClipboard)

Vue.use(PiniaVuePlugin);
const pinia = createPinia();
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
