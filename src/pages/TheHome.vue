<template>
    <div class="container">
        <div class="row mt-5 mb-5">
            <div class="col-lg-7 col-md-12">
                <h1 class="fw-bold main-title">
                    <span class="teal-color">Task Tally:</span> <br />
                    Efficient Task Management for Freelancers
                </h1>
                <p class="text-secondary mt-4">
                    Task Tally is designed to help freelancers manage multiple
                    tasks from various clients with ease. Whether it's tracking
                    deadlines, organizing client work, or prioritizing tasks,
                    Task Tally provides the tools you need to stay on top of
                    your projects.
                </p>
            </div>
            <div class="col-lg-5 col-md-12">
                <img
                    :src="featuredImgSrc"
                    class="img-fluid"
                    alt="featured Image"
                />
            </div>
        </div>
        <div class="row mt-5 mb-5">
            <div class="col-lg-7 col-md-12">
                <h2 class="fw-bold teal-color secondary-title">
                    What Makes It Special?
                </h2>
                <p class="text-secondary mt-4">
                    <em
                        >Task Tally is designed with freelancers in mind, making
                        it easy to handle multiple clients, projects, and
                        deadlines in one place.</em
                    >
                </p>
            </div>
            <div class="col-lg-5 col-md-12">
                <the-features></the-features>
            </div>
        </div>
    </div>
</template>

<script>
import TheFeatures from '@/components/TheFeatures.vue';
export default {
    data() {
        return {
            featuredImgSrc: require('@/assets/home_featured.jpg'),
        };
    },
    components: { TheFeatures },
};
</script>

<style scoped>
.main-title {
    font-size: 3em;
    line-height: 1.4em;
}
.secondary-title {
    font-size: 1.5em;
}
.teal-color {
    color: #288680;
}

/* For tablets (width of 768px or smaller) */
@media only screen and (max-width: 768px) {
    .main-title {
        font-size: 2em;
        line-height: 1.5em;
    }
}

/* For smartphones (width of 480px or smaller) */
@media only screen and (max-width: 480px) {
    .main-title {
        font-size: 1.5em;
        line-height: 1.2em;
    }
}
</style>
