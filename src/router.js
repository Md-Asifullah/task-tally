import { createWebHistory, createRouter } from 'vue-router';

import TheHome from './pages/TheHome.vue';
import ActiveTasks from './pages/ActiveTasks.vue';
import ArchivedTasks from './pages/ArchivedTasks.vue';
import CreateTask from './pages/CreateTask.vue';
import TheLogin from './pages/TheLogin.vue';
import TheRegister from './pages/TheRegister.vue';
import NotFound from './pages/NotFound.vue';
import EditTask from './pages/EditTask.vue';
import { useAuthStore } from '@/stores/AuthStore.js';

const routes = [
    {
        path: '/',
        name: 'home',
        component: TheHome,
    },
    {
        path: '/active',
        name: 'active', // Named route
        component: ActiveTasks,
        meta: { requiresAuth: true },
    },
    {
        path: '/archived',
        name: 'archived',
        component: ArchivedTasks,
        meta: { requiresAuth: true },
    },
    {
        path: '/create_task',
        name: 'create',
        component: CreateTask,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: TheLogin,
        meta: { requiresUnAuth: true },
    },
    {
        path: '/register',
        name: 'register',
        component: TheRegister,
        meta: { requiresUnAuth: true },
    },
    {
        path: '/edit/:id',
        name: 'edit',
        component: EditTask,
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*', // Catch-all route for 404
        name: 'NotFound',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
        next('/login');
    } else if (to.meta.requiresUnAuth && authStore.isAuthenticated()) {
        next('/active');
    } else {
        next();
    }
});

export default router;
