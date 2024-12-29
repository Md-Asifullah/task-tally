<template>
    <div class="text-center mt-5">
        <h1 class="title">Login</h1>
    </div>
    <div class="container mt-4">
        <transition name="fade">
            <auth-notification
                v-if="!formIsValid || showSuccessNotification"
                :message="message"
                :type="notificationType"
            ></auth-notification>
        </transition>
        <loading-spinner v-if="isLoading"></loading-spinner>
        <div class="row mb-5">
            <div class="col-lg-3 col-md-1"></div>
            <div class="col-lg-6 col-md-10">
                <div class="card shadow border-0">
                    <div class="card-body p-4">
                        <form @submit.prevent="signIn">
                            <div class="mb-3">
                                <label
                                    for="exampleInputEmail1"
                                    class="form-label"
                                    >Email address</label
                                >
                                <input
                                    type="email"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    v-model="email"
                                    required
                                />
                                <div id="emailHelp" class="form-text">
                                    We'll never share your email with anyone
                                    else.
                                </div>
                            </div>
                            <div class="mb-3">
                                <label
                                    for="exampleInputPassword1"
                                    class="form-label"
                                    >Password</label
                                >
                                <input
                                    type="password"
                                    class="form-control"
                                    id="exampleInputPassword1"
                                    v-model="password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                class="btn btn-primary app-btn"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-1"></div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
const authStore = useAuthStore();
import { useRouter } from 'vue-router';
const router = useRouter();
import AuthNotification from '../components/UI/AuthNotification.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const formIsValid = ref(true);
const message = ref('Please enter a valid username and password');
const isLoading = ref(false);
const notificationType = ref('alert-danger');
const showSuccessNotification = ref(false);

const signIn = () => {
    // Force formIsValid to toggle for reactivity
    formIsValid.value = true;

    // Validate email and password
    if (
        email.value.trim() === '' ||
        !email.value.includes('@') ||
        password.value.trim().length < 6
    ) {
        // Introduce a small delay to ensure the DOM notices the toggle
        setTimeout(() => {
            formIsValid.value = false;
        }, 0);
        return;
    }

    handleSignin();

    // Send appropriate http request
};

const handleSignin = async () => {
    isLoading.value = true;

    notificationType.value = 'alert-danger';
    showSuccessNotification.value = false;
    try {
        const result = await authStore.signin({
            email: email.value,
            password: password.value,
        });

        // console.log('🧨');
        // console.log(result);

        if (!result.success) {
            // console.log('🧨');
            // console.log(result);
            formIsValid.value = false;
            message.value = result.message;
            isLoading.value = false;
            return;
        } else {
            showSuccessNotification.value = true;
            notificationType.value = 'alert-success';
            message.value = 'Login Successful!';
            setTimeout(() => {
                router.replace('active');
            }, 2000);
        }
    } catch (error) {
        //
    }
    isLoading.value = false;
};
</script>

<style>
/* Fade transition styles */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
