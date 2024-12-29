<template>
    <nav class="navbar navbar-expand-lg" data-bs-theme="dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="{ name: 'home' }"
                ><img class="mt-2 logo" :src="logoImgSrc" alt=""
            /></router-link>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item me-3" v-if="isLoggedIn">
                        <router-link
                            class="nav-link active"
                            aria-current="page"
                            :to="{ name: 'active' }"
                            >Active Tasks</router-link
                        >
                    </li>
                    <li class="nav-item me-3" v-if="isLoggedIn">
                        <router-link
                            class="nav-link active"
                            aria-current="page"
                            :to="{ name: 'archived' }"
                            >Archived Tasks</router-link
                        >
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <router-link
                            class="nav-link active"
                            aria-current="page"
                            :to="{ name: 'create' }"
                            >+ Create A New Task</router-link
                        >
                    </li>
                </ul>
                <form class="d-flex" role="search">
                    <router-link
                        v-if="!isLoggedIn"
                        type="button"
                        class="btn btn-outline-light me-2"
                        :to="{ name: 'register' }"
                    >
                        Register
                    </router-link>
                    <router-link
                        v-if="!isLoggedIn"
                        type="button"
                        class="btn btn-outline-light"
                        :to="{ name: 'login' }"
                    >
                        Login
                    </router-link>
                    <div class="d-flex align-items-center" v-if="isLoggedIn">
                        <p class="mb-0 me-4 text-white">Hello {{ fullName }}</p>
                        <button
                            type="button"
                            class="btn btn-outline-light"
                            @click="logout"
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
import { ref, computed, watch } from 'vue';
const authStore = useAuthStore();
const logoImgSrc = require('@/assets/task_tally_logo.png');
const fullName = ref('');

const isLoggedIn = computed(() => {
    return authStore.isAuthenticated();
});

// Function to fetch and set the full name
const fetchFullName = async () => {
    const email = authStore.getEmail();
    if (email) {
        try {
            const fullNameResult = await authStore.getFullName(email);
            fullName.value = fullNameResult || 'Guest';
        } catch (error) {
            console.error('Error fetching full name:', error);
            fullName.value = 'Error fetching name';
        }
    } else {
        fullName.value = '';
    }
};

// Watch for authentication state changes
watch(isLoggedIn, async (newValue) => {
    if (newValue) {
        await fetchFullName();
    } else {
        fullName.value = ''; // Reset full name when logged out
    }
});

const logout = () => {
    authStore.signout();
};
</script>

<style scoped>
.navbar {
    background: #288680; /* Replace with your desired hex color */
}
.logo {
    width: 4.5em;
}
</style>
