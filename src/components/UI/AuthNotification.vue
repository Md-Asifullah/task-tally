<template>
    <div class="row mb-1">
        <div class="col-lg-3 col-md-1"></div>
        <div class="col-lg-6 col-md-10">
            <div
                class="alert alert-dismissible fade show"
                :class="props.type"
                role="alert"
            >
                🔔 {{ props.message }}
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    @click="hideNotificationAction"
                ></button>
            </div>
        </div>
        <div class="col-lg-3 col-md-1"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    message: String,
    type: String,
});
</script>
