import { createApp } from 'vue'
import './assets/sass/styles.sass'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')
