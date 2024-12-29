<template>
    <div class="text-center mt-5">
        <h1 class="title">Update Your Task</h1>
    </div>
    <div class="container mt-4">
        <div class="row mb-5">
            <div class="col-lg-3 col-md-1"></div>
            <div class="col-lg-6 col-md-10">
                <form needs-validation @submit.prevent="updateTask">
                    <div class="mb-3">
                        <label for="task_name" class="form-label"
                            >Task Name <the-asterisk></the-asterisk>
                        </label>
                        <input
                            type="text"
                            class="form-control"
                            id="task_name"
                            placeholder=""
                            required
                            v-model="task.taskName"
                        />
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label"
                            >Description
                            <span class="optional text-secondary"
                                ><em>(Optional)</em></span
                            ></label
                        >
                        <textarea
                            class="form-control"
                            id="description"
                            rows="3"
                            placeholder="Please enter a short description within 2 sentences."
                            v-model="task.description"
                        ></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <label for="description" class="form-label"
                                    >Client Name <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="text"
                                    class="form-control"
                                    aria-label="First name"
                                    required
                                    v-model="task.clientName"
                                />
                            </div>
                            <div class="col">
                                <label for="description" class="form-label"
                                    >Deadline <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="date"
                                    class="form-control"
                                    placeholder="Last name"
                                    aria-label="Last name"
                                    required
                                    v-model="task.deadline"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col">
                                <label for="priority" class="form-label"
                                    >Priority <the-asterisk></the-asterisk
                                ></label>
                                <input
                                    type="range"
                                    class="form-range"
                                    min="0"
                                    max="10"
                                    id="priority"
                                    required
                                    v-model="task.priority"
                                />
                            </div>
                            <div class="col">
                                <label for="priority" class="form-label"
                                    >Status <the-asterisk></the-asterisk
                                ></label>
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    required
                                    v-model="task.status"
                                >
                                    <option value="concept">
                                        Concept Phase
                                    </option>
                                    <option value="assigned" selected>
                                        Assigned
                                    </option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="awaiting_feedback">
                                        Awaiting Feedback
                                    </option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-primary app-btn">
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
            <div class="col-lg-3 col-md-1"></div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore.js';
const authStore = useAuthStore();
import { useTaskStore } from '@/stores/TaskStore.js';
const taskStore = useTaskStore();
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheAsterisk from '@/components/UI/TheAsterisk.vue';
import { useNotificationStore } from '@/stores/NotificationStore.js';
const { hideNotification } = useNotificationStore();
const showNotificationLocal = ref(false);

const router = useRouter();
const notificationStore = useNotificationStore();

const route = useRoute();

const taskId = route.params.id;

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

const todayDate = computed(() => {
    const date = new Date(); // Use the correct task.deadline from props
    const day = date.getDate(); // Get the day
    const month = date.getMonth() + 1; // Get the month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year
    // Format the date as day-month-year and return it
    return `${day}/${month}/${year}`;
});

const task = ref({
    taskName: '',
    description: '',
    clientName: '',
    deadline: '',
    priority: 5,
    status: 'assigned',
    active: true,
    user: 'asif@gmail.com',
    created: todayDate,
    completed: false,
});

const sanitizeEmail = (email) => {
    return email.replace('@', '_at_').replace(/\./g, '_dot_');
};

watch(
    () => task.value.priority,
    (newValue) => {
        task.value.priority = Number(newValue);
    }
);

const updateTask = async () => {
    const updatedData = task.value;
    // console.log(updatedData);
    try {
        await taskStore.updateFields(taskId, updatedData);
        // console.log('🍏 Task to archive task updated successfully.');
        // notificationStore.enableNotification();
        // notificationStore.assignMessage('Task has been successfully updated!');
        notificationMechanism('Task has been successfully updated!');
        // console.log('💍');
        router.push('/active');
    } catch (error) {
        console.error('🍎 Error to archive task:', error);
    }
};

onMounted(() => {
    const sanitizedUser = sanitizeEmail(authStore.email);
    fetch(
        `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}/${taskId}.json?auth=${authStore.token}`
    )
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                // console.log('There were errors.');
            }
        })
        .then(function (data) {
            // console.log(data);
            task.value.taskName = data.taskName;
            task.value.description = data.description;
            task.value.clientName = data.clientName;
            task.value.priority = data.priority;
            task.value.deadline = data.deadline;
            task.value.status = data.status;
        });
});
</script>

<style scoped>
.optional {
    font-size: 0.9em;
}
</style>
