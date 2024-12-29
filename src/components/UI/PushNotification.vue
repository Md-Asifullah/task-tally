<template>
    <div class="row mb-1">
        <div class="col-lg-2 col-md-1"></div>
        <div class="col-lg-8 col-md-10">
            <div
                class="alert alert-success alert-dismissible fade show"
                role="alert"
            >
                🔔 {{ notificationMessage }}
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    @click="hideNotificationAction"
                ></button>
            </div>
        </div>
        <div class="col-lg-2 col-md-1"></div>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/NotificationStore.js';
const { notificationMessage, hideNotification } = useNotificationStore();

const hideNotificationAction = () => {
    hideNotification();
};
</script>
