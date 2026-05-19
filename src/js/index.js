import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

import routes from 'TodoVuexDir/routes';
import myApp from 'TodoVuexDir/index.vue';

import '../scss/global.scss';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(myApp);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
