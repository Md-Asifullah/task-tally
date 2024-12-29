import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/AuthStore.js';

export const useTaskStore = defineStore('taskStore', () => {
    const authStore = useAuthStore();

    const sanitizeEmail = (email) => {
        return email.replace('@', '_at_').replace(/\./g, '_dot_');
    };

    const updateFields = async (taskId, data) => {
        const sanitizedUser = sanitizeEmail(authStore.getEmail());
        const apiUrl = `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}/${taskId}.json?auth=${authStore.token}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to update task: ${response.statusText}`
                );
            }

            const result = await response.json();
            // console.log(
            //     '🎌 From Pinia Store Task updated successfully:',
            //     result
            // );
            return result;
        } catch (error) {
            console.error('🎌 From Pinia Store Error updating task:', error);
            throw error; // Rethrow to handle in the calling function
        }
    };

    const deleteRecord = async (taskId) => {
        // console.log('Deleting task with ID:', taskId);
        const sanitizedUser = sanitizeEmail(authStore.getEmail());
        const taskUrl = `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/${sanitizedUser}/${taskId}.json?auth=${authStore.token}`;
        try {
            const response = await fetch(taskUrl, {
                method: 'DELETE',
            });
            if (response.ok) {
                // console.log('Task deleted successfully');
            } else {
                console.error('Error deleting task');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    return {
        updateFields,
        deleteRecord,
    };
});
