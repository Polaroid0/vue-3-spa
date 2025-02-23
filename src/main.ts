import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(ToastService);

app.mount('#app');

import { useAuthStore } from '@/stores/auth'
useAuthStore().initialize();