<template>
    <div class="row mb-1">
        <div class="col-lg-2 col-md-1"></div>
        <div class="col-lg-8 col-md-10">
            <div class="card p-3">
                <div class="row">
                    <div class="col-10">
                        <h3 class="text-secondary">
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
                        <span
                            ><i
                                @click="restoreRecord"
                                class="bi bi-arrow-counterclockwise icon icon-restore pointer-cursor"
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
                    <div class="col-10 d-flex align-items-center">
                        <p class="description text-secondary">
                            {{ props.task.description }}
                        </p>
                    </div>
                    <div class="col-2"></div>
                </div>
                <!-- Third Line -->
                <div class="row">
                    <div
                        class="col-lg-1 col-md-3 col-sm-6 d-flex align-items-center me-3"
                    >
                        <span class="badge rounded-pill" :class="statusClass">{{
                            status
                        }}</span>
                    </div>

                    <div
                        class="col-lg-3 col-md-3 col-sm-6 d-flex align-items-center ms-lg-3"
                    >
                        <span class="footer-text text-secondary">
                            <strong>Created:</strong> {{ props.task.created }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-2 col-md-1"></div>
    </div>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue';
const props = defineProps({
    task: Object,
});

const emit = defineEmits(['deleteRecord, restoreRecord']);

const statusClass = computed(() => {
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

const deleteRecord = () => {
    emit('deleteRecord', props.task.id); // Emit delete event with task ID
};

const restoreRecord = () => {
    emit('restoreRecord', props.task.id); // Emit delete event with task ID
};
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
.icon-restore,
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
.priority-icon {
    font-size: 1.5em;
    color: #ffcc00;
}
</style>
