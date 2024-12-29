import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const notificationMessage = ref('Default Message');
    const showNotification = ref(false);

    const enableNotification = () => (showNotification.value = true);

    const hideNotification = () => {
        showNotification.value = false;
        // console.log('From Inside Pinia');
    };

    const assignMessage = (msg) => {
        notificationMessage.value = msg;
    };

    return {
        notificationMessage,
        showNotification,
        hideNotification,
        assignMessage,
        enableNotification,
    };
});
