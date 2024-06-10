import { defineStore } from 'pinia';
import { reactive } from 'vue'
import { homePageRoutes } from '@/router'
import useStore from "@/store"
import formatUtils from "@/utils/formatter"

export const useNavigationStore = defineStore('navigation', () => {
  const state = reactive({
    routeStatus: true, // 用于表示全局路由一种行为的标识符
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

  function findIndex(path) {
    return state.naviOptions.findIndex(item => item.path === path);
  }

  function isOptionExist(value) {
    return state.naviOptions.some(item => item.path === value.path);
  }

  const getRouteStatus = () => {
    return state.routeStatus
  }

  const setRouteStatus = (val) => {
    state.routeStatus = val
  }

  const getCurrentIndex = () => {
    return state.currentIndex;
  }

  const updateNaviOption = (path, fullPath, params) => {
    // 利用原有的 URL 构造新的带参 URL
    let index = findIndex(fullPath)
    let constructedPath = ""
    if (index > -1) {
      constructedPath = formatUtils.constructUrl(path, params)
      state.naviOptions[index].path = constructedPath;
      useStore.navigationStore.setCurrentIndex(constructedPath)
    }
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
    getRouteStatus,
    setRouteStatus,
    getCurrentIndex,
    updateNaviOption,
    setCurrentIndex,
    addNaviOptions,
    addBottomNaviOptions,
    getNaviOptions,
    clearOptionsList,
    initOptionList,
    deleteOption,
  }
}, {
  persistent: true,
});

