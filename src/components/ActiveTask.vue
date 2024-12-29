<template>
    <div class="row mb-1">
        <div class="col-lg-2 col-md-1"></div>
        <div class="col-lg-8 col-md-10">
            <div class="card p-3" :class="showBorder ? 'border-success' : ''">
                <div class="row">
                    <div class="col-1">
                        <div class="form-check">
                            <input
                                class="form-check-input statusCheckBox pointer-cursor"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                :checked="props.task.completed"
                                @click="toggleCompleted"
                            />
                        </div>
                    </div>
                    <div class="col-9">
                        <h3>
                            <b>{{ props.task.taskName }}</b>
                        </h3>
                        <p class="text-secondary client-text">
                            <strong
                                ><i
                                    class="bi bi-person-circle teal-text"
                                ></i> </strong
                            >&nbsp;
                            <span class="teal-text">{{
                                props.task.clientName
                            }}</span>
                        </p>
                    </div>
                    <div class="col-2 icon-group">
                        <router-link
                            :to="{
                                name: 'edit',
                                params: { id: props.task.id },
                            }"
                            ><i
                                class="bi bi-pencil-fill icon icon-edit pointer-cursor"
                            ></i
                        ></router-link>
                        <span class="ms-3"
                            ><i
                                @click="archiveRecord"
                                class="bi bi-archive icon icon-edit dark-gray-text pointer-cursor"
                            ></i
                        ></span>
                        <span class="ms-3"
                            ><i
                                @click="deleteRecord"
                                class="bi bi-trash icon text-danger pointer-cursor"
                            ></i
                        ></span>
                    </div>
                </div>
                <!-- Second Line -->
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-9 d-flex align-items-center">
                        <p class="description text-secondary">
                            {{ props.task.description }}
                        </p>
                    </div>
                    <div class="col-2"></div>
                </div>
                <!-- Third Line -->
                <div class="row">
                    <div class="col-lg-1 col-sm-1"></div>
                    <div class="col-lg-2 col-sm-6 d-flex align-items-center">
                        <span class="badge rounded-pill" :class="statusClass">
                            {{ status }}</span
                        >
                    </div>
                    <div class="col-lg-4 col-sm-5 d-flex align-items-center">
                        <span class="footer-text secondary">
                            <i class="bi bi-calendar-week deadline-icon"></i
                            >&nbsp; {{ deadline }} :
                            <span
                                v-if="daysRemaining > 0"
                                class="text-success fw-bold"
                            >
                                {{ daysRemaining }} days left
                            </span>

                            <span
                                v-else-if="daysRemaining === 0"
                                class="text-warning fw-bold"
                            >
                                Today is the deadline
                            </span>

                            <span v-else class="text-danger fw-bold">
                                Deadline has passed
                            </span>
                        </span>
                    </div>
                    <div class="col-lg-2 col-sm-5 d-flex align-items-center">
                        <span class="footer-text text-dark">
                            <i
                                class="bi bi-flag-fill priority-icon"
                                :style="{ color: priorityFlag }"
                            ></i
                            >&nbsp;
                            <span class="priority-label">{{
                                priorityLabel
                            }}</span>
                        </span>
                    </div>
                    <div class="col-lg-3 col-sm-6 d-flex align-items-center">
                        <span class="footer-text text-secondary">
                            Created: {{ props.task.created }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-md-1"></div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { useTaskStore } from '@/stores/TaskStore.js';
const taskStore = useTaskStore();
const override = ref(false);
const overrideValue = ref('completed');
const overrideStatusClass = ref('text-bg-success');

const props = defineProps({
    task: Object,
});

const showBorder = ref(props.task.completed);
// Define the events you want to emit
const emit = defineEmits(['deleteRecord', 'archiveRecord']);

const deleteRecord = () => {
    emit('deleteRecord', props.task.id); // Emit delete event with task ID
};

const toggleCompleted = async () => {
    let updatedData = {};
    if (showBorder.value === true) {
        updatedData = { completed: !showBorder.value, status: 'in_progress' };
        // 🚩
        override.value = true;
        overrideValue.value = 'in_progress';
        overrideStatusClass.value = 'text-bg-primary';
    } else {
        updatedData = { completed: !showBorder.value, status: 'completed' };
        // 🚩
        override.value = true;
        overrideValue.value = 'completed';
        overrideStatusClass.value = 'text-bg-success';
    }
    try {
        await taskStore.updateFields(props.task.id, updatedData);
        // console.log('🍏 Task updated successfully.');
        showBorder.value = updatedData.completed;
    } catch (error) {
        console.error('🍎 Error updating task:', error);
    }
};

const archiveRecord = () => {
    emit('archiveRecord', props.task.id); // Emit delete event with task ID
};

const statusClass = computed(() => {
    if (override.value) {
        return overrideStatusClass.value;
    }

    if (props.task.status === 'assigned') {
        return 'text-bg-dark';
    }
    if (props.task.status === 'completed') {
        return 'text-bg-success';
    }
    if (props.task.status === 'in_progress') {
        return 'text-bg-primary';
    }
    if (props.task.status === 'concept') {
        return 'text-bg-secondary';
    }
    if (props.task.status === 'awaiting_feedback') {
        return 'text-bg-warning';
    }
    if (props.task.status === 'cancelled') {
        return 'text-bg-danger';
    }
    return ''; // Fallback value if the condition is not met
});

const status = computed(() => {
    if (override.value) {
        return overrideValue.value;
    }

    if (props.task.status === 'assigned') {
        return 'Assigned';
    }
    if (props.task.status === 'completed') {
        return 'Completed';
    }
    if (props.task.status === 'in_progress') {
        return 'In Progress';
    }
    if (props.task.status === 'concept') {
        return 'Concept';
    }
    if (props.task.status === 'awaiting_feedback') {
        return 'Awaiting Feedback';
    }
    if (props.task.status === 'cancelled') {
        return 'Cancelled';
    }
    return props.task.status; // Fallback value if the condition is not met
});

const priorityFlag = computed(() => {
    const priority = Number(props.task.priority);
    switch (priority) {
        case 0:
            return '#4CAF50'; // Soft Green
        case 1:
            return '#4CAF50'; // Soft Green
        case 2:
            return '#81C784'; // Light Green
        case 3:
            return '#AED581'; // Lime Green
        case 4:
            return '#DCE775'; // Yellow-Green
        case 5:
            return '#FFF176'; // Soft Yellow
        case 6:
            return '#FFD54F'; // Light Amber
        case 7:
            return '#FFB74D'; // Soft Orange
        case 8:
            return '#FF8A65'; // Coral
        case 9:
            return '#F06292'; // Light Pink
        case 10:
            return '#E57373'; // Soft Red
        default:
            return '#EF5350'; // Muted Red (fallback)
    }
});

const priorityLabel = computed(() => {
    const priority = Number(props.task.priority);
    switch (true) {
        case priority >= 0 && priority <= 3:
            return 'Low Priority'; // Green shades (Low)
        case priority >= 4 && priority <= 7:
            return 'Medium Priority'; // Yellow and Orange shades (Medium)
        case priority >= 8 && priority <= 10:
            return 'High Priority'; // Red shades (High)
        default:
            return 'Unknown Priority'; // Fallback case
    }
});

const deadline = computed(() => {
    const date = new Date(props.task.deadline); // Use the correct task.deadline from props
    const day = date.getDate(); // Get the day
    const month = date.getMonth() + 1; // Get the month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year

    // Format the date as day-month-year and return it
    return `${day}/${month}/${year}`;
});

const daysRemaining = computed(() => {
    const deadlineDate = new Date(props.task.deadline);
    const currentDate = new Date(); // Get the current date

    // Set the time to 00:00:00 for both dates to avoid issues with time
    currentDate.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const timeDifference = deadlineDate - currentDate;

    // Calculate the number of days remaining
    const daysRemaining = timeDifference / (1000 * 3600 * 24);

    // Return appropriate value based on days remaining
    if (daysRemaining > 0) {
        return Math.ceil(daysRemaining); // Days remaining if deadline is in the future
    } else if (daysRemaining === 0) {
        return 0; // 0 if the deadline is today
    } else {
        return -1; // -1 if the deadline is in the past
    }
});

// console.log('Start');
// console.log(props.task.clientName);
// console.log('End');
</script>

<style scoped>
.statusCheckBox {
    width: 25px;
    height: 25px;
    border: 2px solid #288680;
}
h3 {
    font-size: 1em;
}
.icon-group {
    text-align: end;
}
.icon {
    font-size: 1.5em;
}
.icon-edit,
.teal-text {
    color: #288680;
}
.description {
    font-size: 0.75em;
    margin-bottom: 0.4em;
}
.client-text {
    font-size: 1em;
    margin-top: 0;
    margin-bottom: 0.4em;
}
.footer-text {
    font-size: 0.8em;
}
.priority-icon,
.deadline-icon {
    font-size: 1.5em;
}
.dark-gray-text {
    color: #212529;
}
.priority-label {
    font-size: 0.9em;
}
</style>
