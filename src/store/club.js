import { defineStore } from 'pinia';
import { reactive, computed } from 'vue'

export const useClubStore = defineStore('club', () => {
    const state = reactive({
        clubName: "408", //TODO: 3.0开发进程获取
    })

    const getClubName = computed(() => state.clubName)

    const setClubName = (val) => {
        state.clubName = val;
    }

    return {
        getClubName,
        setClubName
    }
}, {
    persistent: true,
});

