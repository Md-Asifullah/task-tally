import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const userId = ref(null);
    const token = ref(null);
    const email = ref('');
    const fullNameSet = ref(false);
    let timer;

    // Access the API key from environment variables
    const apiKey = 'import.meta.env.VITE_API_KEY';

    const signin = async (payload) => {
        try {
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: payload.email,
                        password: payload.password,
                        returnSecureToken: true,
                    }),
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(
                    responseData.error.message || 'Failed to authenticate'
                );
                throw error;
            }

            const expiresIn = +responseData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;

            localStorage.setItem('email', payload.email);
            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

            timer = setTimeout(() => {
                signout();
            }, expiresIn);

            setUser({
                email: payload.email,
                token: responseData.idToken,
                userId: responseData.localId,
            });

            // console.log(responseData);
            return { success: true };
        } catch (error) {
            console.error(error);
            // console.log('🎈');
            return { success: false, message: error.toString() };
        }
    };

    const autoLogin = () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime();

        if (expiresIn < 0) {
            return;
        }

        setTimeout(() => {
            signout();
        }, expiresIn);

        if (token && userId && email && tokenExpiration) {
            setUser({
                email: email,
                token: token,
                userId: userId,
            });
        }
    };

    const signup = async (payload) => {
        try {
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: payload.email,
                        password: payload.password,
                        returnSecureToken: true,
                    }),
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(
                    responseData.error.message || 'Failed to authenticate'
                );
                throw error;
            }

            const expiresIn = +responseData.expiresIn * 1000;
            const expirationDate = new Date().getTime() + expiresIn;

            localStorage.setItem('email', payload.email);
            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('tokenExpiration', expirationDate);

            timer = setTimeout(() => {
                signout();
            }, expiresIn);

            fullNameSet.value = true;
            localStorage.setItem(
                'fullName',
                payload.firstName + ' ' + payload.lastName
            );

            setUser({
                email: payload.email,
                token: responseData.idToken,
                userId: responseData.localId,
            });

            // ⛔ Does not work before authentication
            storeUserInfo(token.value, {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
            });

            // Return success
            return { success: true };
        } catch (error) {
            console.error(error);
            // console.log('🎈');
            // alert(error.message);
            return { success: false, message: error.toString() };
        }
    };

    const signout = () => {
        clearTimeout(timer);
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');
        userId.value = null;
        token.value = null;
        email.value = '';
        router.replace('/');
    };

    const setUser = (payload) => {
        email.value = payload.email;
        token.value = payload.token;
        userId.value = payload.userId;
    };

    const storeUserInfo = (token, payload) => {
        fetch(
            `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?auth=${token}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Request failed with status ${response.status}`
                    );
                }
                return response.json(); // Return the parsed JSON
            })
            .catch(() => {
                alert('There was an error!');
            });
    };

    const isAuthenticated = () => {
        return !!token.value;
    };

    const getEmail = () => {
        return email.value;
    };

    const getFullName = async (email) => {
        if (fullNameSet.value) {
            return localStorage.getItem('fullName');
        }
        try {
            // console.log('Inside getFullName function:');
            const response = await fetch(
                `https://task-tally-7a223-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?auth=${token.value}`
            );

            if (!response.ok) {
                throw new Error(response.error || 'Failed to load data');
            }

            const data = await response.json();

            if (!data) {
                throw new Error('No data received');
            }

            // console.log(email);
            const valuesArray = Object.values(data);
            // console.log(valuesArray);

            const result = valuesArray.filter((item) => item.email === email);
            // console.log('💎');
            // console.log(result);

            const fullName = result
                .map((item) => `${item.firstName} ${item.lastName}`)
                .join(' ');

            // console.log(fullName || 'No matching user found.');
            return fullName || null; // Return null if no matches
        } catch (error) {
            console.error('Error:', error.toString());
            return null; // Return null in case of errors
        }
    };

    return {
        userId,
        signup,
        setUser,
        token,
        storeUserInfo,
        signin,
        email,
        isAuthenticated,
        getEmail,
        getFullName,
        signout,
        autoLogin,
    };
});
