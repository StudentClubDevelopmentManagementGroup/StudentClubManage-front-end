import { ref, computed } from 'vue';
import { defineStore } from "pinia";
import { getConfig, responsiveStorageNameSpace } from "@/config";
import { storageLocal } from "@pureadmin/utils";

export const useThemeStore = defineStore('theme', () => {
    const state = ref({
        themeColor: getConfig().EpThemeColor,
        theme: getConfig().Theme
    });

    const getThemeColor = computed(() => state.value.themeColor);
    const fill = computed(() => {
        if (state.value.theme === "light") {
            return "#409eff";
        } else {
            return "#fff";
        }
    });
    
    function setEpThemeColor(newColor) {
        const layout = storageLocal().getItem(
            `${responsiveStorageNameSpace()}layout`
        );
        this.epTheme = layout?.theme;
        this.epThemeColor = newColor;
        if (!layout) return;
        layout.epThemeColor = newColor;
        storageLocal().setItem(`${responsiveStorageNameSpace()}layout`, layout);
    }

    return {
        getThemeColor, fill, setEpThemeColor
    }
}, {
    persistent: true,
})