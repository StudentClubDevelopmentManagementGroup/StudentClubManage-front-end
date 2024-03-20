import { defineStore } from "pinia";
import { getConfig } from "@/config";

export const useSettingStore = defineStore("setting", () => {
  const getInfo = () => {
    return {
      title: getConfig().Title,
      fixedHeader: getConfig().FixedHeader,
      hiddenSideBar: getConfig().HiddenSideBar,
      showLogo: getConfig().ShowLogo,
    }
  };

  const state = getInfo();

  const changeSetting = ({ key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  };

  return {
    state,
    changeSetting,
  }
}, {
    persistent: true,
  })

