<template>
    <div class="container">
        <h1 class="text-center mt-4 mb-4">All Active Tasks</h1>

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
            <active-filter
                :tasks="filteredTasksForFilter"
                @filteredValues="handleFilter"
                @clearFilter="handleClearFilter"
            ></active-filter>
            <active-task
                v-for="task in filteredTasks"
                :key="task.id"
                :task="task"
                @deleteRecord="handleDelete"
                @archiveRecord="handleArchiveRecord"
            ></active-task>
            <no-active v-if="filteredTasks.length === 0"></no-active>
        </div>
    </div>
    <div class="mb-3">&nbsp;</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
const authStore = useAuthStore();
import { useTaskStore } from '@/stores/TaskStore.js';
const taskStore = useTaskStore();
import ActiveTask from '@/components/ActiveTask.vue';
import ActiveFilter from '@/components/UI/ActiveFilter.vue';
import PushNotification from '@/components/UI/PushNotification.vue';
import NoActive from '@/components/UI/NoActive.vue';
import { onMounted, ref, computed } from 'vue';
import { useNotificationStore } from '@/stores/NotificationStore.js';
const { hideNotification } = useNotificationStore();
const notificationStore = useNotificationStore();
const showNotificationLocal = ref(false);
const filterClient = ref('');
const filterPriority = ref('');
const filterStatus = ref('');
const apiResourceLoadingError = ref(false);
const apiErrorMessage = ref('');

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

// const user = authStore.email;
const tasks = ref([]);
const tasksForFilter = ref([]);
const isLoading = ref(true); // State to track loading status

// Computed property to filter active tasks
const filteredTasks = computed(() => {
    return tasks.value.filter((task) => task.active === true);
});

const filteredTasksForFilter = computed(() => {
    return tasksForFilter.value.filter((task) => task.active === true);
});

const handleFilter = (value) => {
    filterClient.value = value[0].value;
    filterPriority.value = value[1].value;
    filterStatus.value = value[2].value;

    tasks.value = [...tasksForFilter.value];

    if (filterClient.value != 'Select Client') {
        tasks.value = tasks.value.filter(
            (task) => task.clientName === filterClient.value
        );
    }

    if (filterPriority.value != 'Select Priority') {
        if (filterPriority.value === '1') {
            tasks.value = tasks.value.filter((task) => task.priority >= 8);
        }
        if (filterPriority.value === '2') {
            tasks.value = tasks.value.filter(
                (task) => task.priority >= 4 && task.priority <= 7
            );
        }
        if (filterPriority.value === '3') {
            tasks.value = tasks.value.filter((task) => task.priority <= 3);
        }
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

setTimeout(() => {
    if (notificationStore.showNotification) {
        hideNotification();
    }
}, 3000); // Increase delay if notifications disappear too quickly

const handleDelete = async (taskId) => {
    if (confirm('Are you sure to delete the task?')) {
        try {
            await taskStore.deleteRecord(taskId);
            // console.log('🍏 Task to delete task completed successfully.');
            tasks.value = tasks.value.filter((task) => task.id !== taskId);
            notificationMechanism('Task has been successfully deleted!');
        } catch (error) {
            console.error('🍎 Error to delete task:', error);
        }
    }
};

const handleArchiveRecord = async (taskId) => {
    const updatedData = {
        active: false,
    };

    try {
        await taskStore.updateFields(taskId, updatedData);
        // console.log('🍏 Task to archive task completed successfully.');
        const index = tasks.value.findIndex((task) => task.id === taskId);
        if (index !== -1) {
            tasks.value.splice(index, 1); // Remove the task from the array
        }
        notificationMechanism('Task has been successfully archived!');
    } catch (error) {
        console.error('🍎 Error to archive task:', error);
    }
};

const sanitizeEmail = (email) => {
    return email.replace('@', '_at_').replace(/\./g, '_dot_');
};

onMounted(() => {
    apiResourceLoadingError.value = false;
    showNotificationLocal.value = false;
    const sanitizedUser = sanitizeEmail(authStore.email);
    fetch(
        `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}.json?auth=${authStore.token}`
    )
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                const error = new Error(
                    response.error || 'Failed to load data'
                );
                // console.log(error.toString());
                apiResourceLoadingError.value = true;
                apiErrorMessage.value = error.toString();
                // notificationMechanism(error.toString());
                // throw error;
            }
        })
        .then(function (data) {
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
            const today = new Date();
            results.sort((a, b) => {
                const deadlineA = new Date(a.deadline);
                const deadlineB = new Date(b.deadline);

                const isTodayA =
                    deadlineA.toDateString() === today.toDateString();
                const isTodayB =
                    deadlineB.toDateString() === today.toDateString();

                const isExpiredA = deadlineA < today;
                const isExpiredB = deadlineB < today;

                // If one task has a deadline of today, prioritize it
                if (isTodayA && !isTodayB) return -1;
                if (!isTodayA && isTodayB) return 1;

                // If one task is expired and the other is not, prioritize the non-expired task
                if (isExpiredA !== isExpiredB) return isExpiredA - isExpiredB;

                // Otherwise, sort by the closest deadline to today
                return deadlineA - deadlineB;
            });
            tasks.value = results;
            tasksForFilter.value = [...results];
        })
        .finally(() => {
            isLoading.value = false; // Stop loading once the data is fetched
        });
});
</script>
