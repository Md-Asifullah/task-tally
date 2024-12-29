<template>
    <div class="row mb-3">
        <div class="col-lg-2 col-md-1"></div>
        <div class="col-lg-8 col-md-10 d-flex justify-content-end">
            <button
                type="button"
                class="btn btn-sm app-btn-outline"
                :class="toggleButtonClass"
                @click="toggleFilter"
            >
                {{ toggleButtonText }}
            </button>
        </div>
        <div class="col-lg-2 col-md-1"></div>
    </div>
    <transition name="fade">
        <div class="row mb-4 mt-4" v-if="showFilter">
            <div class="col-lg-2 col-md-1"></div>
            <div class="col-lg-8 col-md-10">
                <div class="row">
                    <div class="col-lg-5 col-md-5">
                        <select
                            class="form-select form-select-sm"
                            aria-label="Small select example"
                            v-model="selectedClient"
                        >
                            <option disabled selected>Select Client</option>
                            <option
                                :value="name"
                                v-for="name in clients"
                                :key="name"
                            >
                                {{ name }}
                            </option>
                        </select>
                    </div>

                    <div class="col-lg-5 col-md-5">
                        <select
                            class="form-select form-select-sm"
                            aria-label="Small select example"
                            v-model="selectedStatus"
                        >
                            <option disabled selected>Select Status</option>

                            <option value="concept">Concept Phase</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="awaiting_feedback">
                                Awaiting Feedback
                            </option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="col-lg-2 col-md-2 d-flex justify-content-end">
                        <button
                            type="button"
                            class="btn btn-sm btn-primary app-btn"
                            @click="filter"
                        >
                            <i class="bi bi-search"></i> Search
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-1"></div>
        </div>
    </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
const showFilter = ref(false);
const toggleButtonClass = ref('btn-outline-success');
const toggleButtonText = ref('Filter');
const selectedClient = ref('Select Client');
const selectedStatus = ref('Select Status');

const emit = defineEmits(['filteredValues', 'clearFilter']);

const filter = () => {
    emit('filteredValues', [selectedClient, selectedStatus]);
};

const props = defineProps({
    tasks: Object,
});

const clients = computed(() => {
    return [...new Set(props.tasks.map((task) => task.clientName))];
});

const toggleFilter = () => {
    showFilter.value = !showFilter.value;
    // 🔥 Filter is Enabled
    if (showFilter.value) {
        toggleButtonClass.value = 'btn-outline-danger';
        toggleButtonText.value = 'Clear Filter';
        // console.log('🔍 Tasks from Filter');
        // console.log(props.tasks);
    } else {
        // 🧊 Filter is Disabled
        toggleButtonClass.value = 'btn-outline-success';
        toggleButtonText.value = 'Filter';
        selectedClient.value = 'Select Client';
        selectedStatus.value = 'Select Status';
        emit('clearFilter');
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
