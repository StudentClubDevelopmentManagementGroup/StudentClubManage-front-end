import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { homePageRoutes } from '@/router'

export const useNavigationStore = defineStore('navigation', () => {
  const state = reactive({
    naviOptions: [],
    routes: homePageRoutes,
    currentIndex: '',
  })

  const getCurrentIndex = () => {
    return state.currentIndex;
  }

  const setCurrentIndex = (index) => {
    state.currentIndex = index;
  }
  const addNaviOptions = (value) => {
    state.naviOptions.push(value);
  }

  const getNaviOptions = () => {
    return state.naviOptions;
  }

  const clearOptionsList = () => {
    state.currentIndex = "";
    state.naviOptions = [];
  }

  const getNaviOptionsList = () => {
    clearOptionsList();
    state.routes.forEach(element => {
      if (!element?.meta || (element?.meta && !element.meta?.hidden)) {
        for (let route of element.children) {
          if (!element?.meta || (element?.meta && !element.meta?.hidden)) {
            addNaviOptions(route);
          }
        }
      }
    });
  }

  return {
    getCurrentIndex,
    setCurrentIndex,
    addNaviOptions,
    getNaviOptions,
    getNaviOptionsList,
  }
}, {
  persistent: true,
});

