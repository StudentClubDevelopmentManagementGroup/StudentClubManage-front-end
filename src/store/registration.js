import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useRegistrationStore = defineStore('registration', () => {
    const rolePage = ref(2)

    const setRolePage = (value) => {
        rolePage.value = value;
    }

    return {
        // state
        rolePage,

        // action
        setRolePage,
    }
}, {
    persistent: true,
});

