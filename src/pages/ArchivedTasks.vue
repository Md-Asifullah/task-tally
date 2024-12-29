<template>
    <div class="container">
        <h1 class="text-center mt-4 mb-4 text-secondary">All Archived Tasks</h1>
        <loading-spinner v-if="isLoading"></loading-spinner>
        <auth-notification
            v-else-if="apiResourceLoadingError"
            :message="apiErrorMessage"
            :type="'alert-danger'"
        ></auth-notification>
        <div v-else>
            <push-notification
                v-if="notificationStore.showNotification"
            ></push-notification>
            <archive-filter
                :tasks="filteredTasksForFilter"
                @filteredValues="handleFilter"
                @clearFilter="handleClearFilter"
            ></archive-filter>
            <archived-task
                v-for="task in filteredTasks"
                :key="task.id"
                :task="task"
                @deleteRecord="handleDelete"
                @restoreRecord="handleRestoreRecord"
            ></archived-task>
            <no-active v-if="filteredTasks.length === 0"> archived </no-active>
        </div>
    </div>
    <div class="mb-3">&nbsp;</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
const authStore = useAuthStore();
import { useTaskStore } from '@/stores/TaskStore.js';
const taskStore = useTaskStore();
import ArchivedTask from '@/components/ArchivedTask.vue';
import ArchiveFilter from '@/components/UI/ArchiveFilter.vue';
import { onMounted, ref, computed } from 'vue';
import PushNotification from '@/components/UI/PushNotification.vue';
import NoActive from '@/components/UI/NoActive.vue';
import { useNotificationStore } from '@/stores/NotificationStore.js';
const { hideNotification } = useNotificationStore();
const notificationStore = useNotificationStore();
const showNotificationLocal = ref(false);
const filterClient = ref('');
const filterStatus = ref('');
const apiResourceLoadingError = ref(false);
const apiErrorMessage = ref('');

const tasks = ref([]);
const tasksForFilter = ref([]);
const isLoading = ref(true); // State to track loading status

// Computed property to filter active tasks
const filteredTasks = computed(() => {
    return tasks.value.filter((task) => task.active === false);
});

const filteredTasksForFilter = computed(() => {
    return tasksForFilter.value.filter((task) => task.active === false);
});

const handleFilter = (value) => {
    filterClient.value = value[0].value;
    filterStatus.value = value[1].value;
    tasks.value = [...tasksForFilter.value];

    if (filterClient.value != 'Select Client') {
        tasks.value = tasks.value.filter(
            (task) => task.clientName === filterClient.value
        );
    }

    if (filterStatus.value != 'Select Status') {
        tasks.value = tasks.value.filter(
            (task) => task.status === filterStatus.value
        );
    }
};

const handleClearFilter = () => {
    tasks.value = [...tasksForFilter.value];
};

const notificationMechanism = (message) => {
    hideNotification();
    notificationStore.enableNotification();
    notificationStore.assignMessage(message);
    showNotificationLocal.value = true;
    setTimeout(() => {
        if (notificationStore.showNotification) {
            hideNotification();
        }
    }, 3000); // Increase delay if notifications disappear too quickly
};

const sanitizeEmail = (email) => {
    return email.replace('@', '_at_').replace(/\./g, '_dot_');
};

const handleDelete = async (taskId) => {
    try {
        await taskStore.deleteRecord(taskId);
        // console.log('🍏 Task to delete task completed successfully.');
        tasks.value = tasks.value.filter((task) => task.id !== taskId);
        notificationMechanism('Task has been successfully deleted!');
    } catch (error) {
        console.error('🍎 Error to delete task:', error);
    }
};

const handleRestoreRecord = async (taskId) => {
    const updatedData = {
        active: true,
    };

    try {
        await taskStore.updateFields(taskId, updatedData);
        // console.log('🍏 Task to archive task completed successfully.');
        const index = tasks.value.findIndex((task) => task.id === taskId);
        if (index !== -1) {
            tasks.value.splice(index, 1); // Remove the task from the array
        }
        notificationMechanism('Task has been successfully restored!');
    } catch (error) {
        console.error('🍎 Error to archive task:', error);
    }
};

onMounted(() => {
    const sanitizedUser = sanitizeEmail(authStore.email);
    fetch(
        `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}.json?auth=${authStore.token}`
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                const error = new Error(
                    response.error || 'Failed to load data'
                );
                // console.log(error.toString());
                apiResourceLoadingError.value = true;
                apiErrorMessage.value = error.toString();
            }
        })
        .then((data) => {
            const results = [];
            for (const id in data) {
                results.push({
                    id: id,
                    active: data[id].active,
                    clientName: data[id].clientName,
                    deadline: data[id].deadline,
                    description: data[id].description,
                    priority: data[id].priority,
                    status: data[id].status,
                    taskName: data[id].taskName,
                    user: data[id].user,
                    created: data[id].created,
                    completed: data[id].completed,
                });
            }
            results.sort((a, b) => {
                const parseDate = (dateStr) => {
                    const [day, month, year] = dateStr.split('/');
                    return new Date(`${year}-${month}-${day}`);
                };

                const createdA = parseDate(a.created);
                const createdB = parseDate(b.created);

                // Sort in descending order
                return createdB - createdA;
            });
            tasks.value = results;
            tasksForFilter.value = [...results];
        })
        .finally(() => {
            isLoading.value = false; // Stop loading once the data is fetched
        });
});
</script>
