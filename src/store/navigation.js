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

  const getCurrentIndex = () => {
    return state.currentIndex;
  }

  const updateNaviOptionTabName = (fullPath, tabName) => {
    let index = findIndex(fullPath)
    if (index > -1) {
      //
      state.naviOptions[index].meta.title = tabName
    } else {
      //
    }
  }

  const updateNaviOptionPath = (path, fullPath, params) => {
    // 利用原有的 URL 构造新的带参 URL
    let index = findIndex(fullPath)
    let constructedPath = ""
    if (index > -1) {
      // 在 Tabs 标签导航中存在标签
      constructedPath = formatUtils.constructUrl(path, params)
      if (isOptionExist({ path: constructedPath })) {
        // 存在现存的标签页，清除掉当前标签页
        deleteOption(path)
      } else {
        // 不存在现存的标签页，将当前标签页的路径导航目标修改
        state.naviOptions[index].path = constructedPath;
      }
      setCurrentIndex(constructedPath)
    } else {
      // 在 Tabs 标签导航中不存在标签，未深虑
      setCurrentIndex(fullPath)
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
    updateNaviOptionTabName,
    updateNaviOptionPath,
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

