import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import { homePageRoutes } from '@/router'

export const useNavigationStore = defineStore('navigation', () => {
    console.log("HomePageRoutes", homePageRoutes)
    const naviOptions = ref([])
    const currentIndex = ref('')

    const setCurrentIndex = (index) => {
        currentIndex.value = index;
    }

    return {
        // state
        naviOptions,
        currentIndex,

        // action
        setCurrentIndex,
    }
}, {
    persistent: true,
});

