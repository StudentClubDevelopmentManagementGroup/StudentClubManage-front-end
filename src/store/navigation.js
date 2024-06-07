import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { homePageRoutes } from '@/router'

export const useNavigationStore = defineStore('navigation', () => {
  const state = reactive({
    naviOptions: [],
    // naviOptions: [{
    //   path: "/homepage/home",
    //   name: "Home",
    //   meta: {
    //     hidden: false,
    //     title: "首页",
    //   },
    // }],
    routes: homePageRoutes,
    currentIndex: '',
  })

  function isOptionExist(value) {
    return state.naviOptions.some(item => item.path === value.path);
  }

  const getCurrentIndex = () => {
    return state.currentIndex;
  }

  const setCurrentIndex = (index) => {
    state.currentIndex = index;
  }

  const addNaviOptions = (value) => {
    if (!isOptionExist(value)) {
      state.naviOptions.push(value);
    }
  }

  const addBottomNaviOptions = (value) => {
    if (!isOptionExist(value)) {
      state.naviOptions.unshift(value);
    }
  }

  const getNaviOptions = () => {
    return state.naviOptions;
  }

  const clearOptionsList = () => {
    state.currentIndex = "";
    state.naviOptions = [];
  }

  const initOptionList = () => {
    state.routes.forEach(element => {
      if (!element?.meta || (element?.meta && !element.meta?.hidden)) {
        for (let route of element.children) {
          if (route?.meta?.fixed) {
            addBottomNaviOptions(route);
          } else if (!route?.meta || (route?.meta && !route.meta?.hidden)) {
            addNaviOptions(route);
          }
        }
      }
    })
  }

  const deleteOption = (route) => {
    const index = state.naviOptions.findIndex(option => option.path === route);
    if (index !== -1) {
      state.naviOptions.splice(index, 1);
    }
  }


  return {
    getCurrentIndex,
    setCurrentIndex,
    addNaviOptions,
    getNaviOptions,
    clearOptionsList,
    initOptionList,
    deleteOption,
  }
}, {
  persistent: true,
});

