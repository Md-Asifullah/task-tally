<template>
    <div class="text-center mt-5">
        <h1 class="title">Create a New Task</h1>
    </div>
    <auth-notification
        v-if="apiError"
        :message="apiErrorMessage"
        :type="'alert-danger'"
    ></auth-notification>
    <div class="container mt-4">
        <div class="row mb-5">
            <div class="col-lg-3 col-md-1"></div>
            <div class="col-lg-6 col-md-10">
                <form needs-validation @submit.prevent="submitTask">
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
                            + Add Task
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import TheAsterisk from '@/components/UI/TheAsterisk.vue';
import { useNotificationStore } from '@/stores/NotificationStore.js';
const { hideNotification } = useNotificationStore();
const showNotificationLocal = ref(false);
const apiError = ref(false);
const apiErrorMessage = ref('');
const errors = ref(false);

const router = useRouter();
const notificationStore = useNotificationStore();

const todayDate = computed(() => {
    const date = new Date(); // Use the correct task.deadline from props
    const day = date.getDate(); // Get the day
    const month = date.getMonth() + 1; // Get the month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year
    // Format the date as day-month-year and return it
    return `${day}/${month}/${year}`;
});

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

const task = ref({
    taskName: '',
    description: '',
    clientName: '',
    deadline: '',
    priority: 5,
    status: 'assigned',
    active: true,
    user: authStore.email,
    created: todayDate,
    completed: false,
});

const sanitizeEmail = (email) => {
    return email.replace('@', '_at_').replace(/\./g, '_dot_');
};

const submitTask = () => {
    apiError.value = false;
    errors.value = false;
    const sanitizedUser = sanitizeEmail(task.value.user);
    fetch(
        `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}.json?auth=${authStore.token}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task.value }),
        }
    )
        .then((response) => {
            if (!response.ok) {
                // throw new Error(
                //     `Request failed with status ${response.status}`
                // );
                const error = new Error(
                    response.error || 'Failed to create record'
                );
                // console.log(error.toString());
                apiError.value = true;
                apiErrorMessage.value = error.toString();
                errors.value = true;
            }
            return response.json(); // Return the parsed JSON
        })
        .then(() => {
            notificationMechanism('Task has been successfully added!');
            if (!errors.value) {
                router.push('active');
            }
        })
        .catch(() => {
            // console.log(error);
            // alert('There was an error!');
        });
};
</script>

<style scoped>
.optional {
    font-size: 0.9em;
}
</style>
