import { defineStore } from "pinia";
import { getConfig } from "@/config";
import { reactive, computed, ref } from "vue";


export const useSettingStore = defineStore("setting", () => {
  const state = ref({
    fixedHeader: getConfig().FixedHeader,
    hideTabs: getConfig().HideTabs,
    hideFooter: getConfig().HideFooter,
    hideHeader: getConfig().HideHeader,
    showLogo: getConfig().ShowLogo,
    showSettings: true,
  });

  const getShowSettings = computed(() => state.value.showSettings);
  const getFixedHeader = computed(() => state.value.fixedHeader);
  const getHideTabs = computed(() => state.value.hideTabs);
  const getHideFooter = computed(() => state.value.hideFooter);
  const getHideHeader = computed(() => state.value.hideHeader);
  const getShowLogo = computed(() => state.value.showLogo);

  const changeSetting = ({ key, value }) => {
    console.log(key);
    if (state.value.hasOwnProperty(key)) {
      if (value === true || value === false) {
        state.value[key] = value;
      } else {
        state.value[key] = !state.value[key];
      }
    };
  }
  return {
    getFixedHeader,
    getHideTabs,
    getHideFooter,
    getHideHeader,
    getShowLogo,
    changeSetting,
    getShowSettings,
  }
}, {
  persistent: true,
})
