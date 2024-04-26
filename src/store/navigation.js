import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import { homePageRoutes } from '@/router'

export const useNavigationStore = defineStore('navigation', () => {
  const naviOptions = ref([]);
  const routes = ref(homePageRoutes)
  const currentIndex = ref('')

  const setCurrentIndex = (index) => {
    currentIndex.value = index;
  }
  const addNaviOptions = (value) => {
    naviOptions.value.push(value);
  }

  const getNaviOptions = () => {
    routes.value.forEach(element => {
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
    // state
    naviOptions,
    currentIndex,

    // action
    setCurrentIndex,
    addNaviOptions,
    getNaviOptions,
  }
}, {
  persistent: true,
});

