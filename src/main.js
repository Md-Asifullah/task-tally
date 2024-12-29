import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import LoadingSpinner from './components/UI/LoadingSpinner.vue';
import AuthNotification from './components/UI/AuthNotification.vue';

const app = createApp(App);
const pinia = createPinia();
app.component('loading-spinner', LoadingSpinner);
app.component('auth-notification', AuthNotification);
app.use(pinia);
app.use(router);
app.mount('#app');
