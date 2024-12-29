<template>
    <div class="wrapper">
        <the-nav></the-nav>
        <router-view></router-view>
        <the-footer></the-footer>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
const authStore = useAuthStore();
import { onMounted } from 'vue';
import TheNav from './components/UI/TheNav.vue';
import TheFooter from './components/UI/TheFooter.vue';

onMounted(() => {
    authStore.autoLogin();
});
</script>

<style>
html {
    height: 100%;
}

:root {
    --font-family-base: 'Poppins', sans-serif;
    --font-family-heading: 'Poppins', sans-serif;
}

body {
    font-family: var(--font-family-base);
    height: 100%;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-family-heading);
}

.wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

a {
    text-decoration: none;
    color: #288680;
}
a:hover {
    color: #f97171;
}
.page-title {
    font-size: 2em;
}
.app-btn {
    background: #288680;
    border: 0;
}
.app-btn:hover {
    background: #000;
}
.app-btn-outline {
    background: #ffffff;
    border: 1px solid 288680;
}
.app-btn-outline:hover {
    background: #000;
}
.pointer-cursor {
    cursor: pointer;
}
</style>
