<template>
    <div class="row mb-1">
        <div class="col-lg-2 col-md-1"></div>
        <div class="col-lg-8 col-md-10">
            <p>
                There are no <slot>active</slot> tasks at the moment, either
                because no task has been created yet or no tasks match your
                filter. Please start by
                <router-link
                    class="link"
                    aria-current="page"
                    :to="{ name: 'create' }"
                >
                    adding a new task
                </router-link>
            </p>
        </div>
        <div class="col-lg-2 col-md-1"></div>
    </div>
</template>

<style scoped></style>
