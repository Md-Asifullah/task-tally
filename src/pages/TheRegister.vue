<template>
    <div class="text-center mt-5">
        <h1 class="title">Register</h1>
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
        <div v-else class="row mb-5">
            <div class="col-lg-3 col-md-1"></div>
            <div class="col-lg-6 col-md-10">
                <div class="card shadow border-0">
                    <div class="card-body p-4">
                        <form @submit.prevent="signUp">
                            <div class="mb-3">
                                <label for="first-name" class="form-label"
                                    >First Name <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="first-name"
                                    required
                                    v-model="firstName"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="last-name" class="form-label"
                                    >Last Name <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="last-name"
                                    required
                                    v-model="lastName"
                                />
                            </div>
                            <div class="mb-3">
                                <label
                                    for="exampleInputEmail1"
                                    class="form-label"
                                    >Email address <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    required
                                    v-model="email"
                                />
                            </div>
                            <div class="mb-3">
                                <label
                                    for="exampleInputPassword1"
                                    class="form-label"
                                    >Password <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="password"
                                    class="form-control"
                                    id="exampleInputPassword1"
                                    required
                                    v-model="password"
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
import TheAsterisk from '@/components/UI/TheAsterisk.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const formIsValid = ref(true);
const message = ref(
    'Please enter valid information. Password needs to be atleast 6 characters'
);
const isLoading = ref(false);
const notificationType = ref('alert-danger');
const showSuccessNotification = ref(false);

const signUp = () => {
    formIsValid.value = true;
    message.value =
        'Please enter valid information. Password needs to be atleast 6 characters';
    if (
        firstName.value === '' ||
        lastName.value === '' ||
        email.value === '' ||
        !email.value.includes('@') ||
        password.value.length < 6
    ) {
        setTimeout(() => {
            formIsValid.value = false;
        }, 0);
        return;
    }

    handleSignup();
};

const handleSignup = async () => {
    isLoading.value = true;
    notificationType.value = 'alert-danger';
    showSuccessNotification.value = false;
    try {
        const result = await authStore.signup({
            firstName: firstName.value,
            lastName: lastName.value,
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
        } else {
            showSuccessNotification.value = true;
            notificationType.value = 'alert-success';
            message.value = 'Registration Successful!';
            setTimeout(() => {
                router.push('active');
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
