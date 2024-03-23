import { defineStore } from 'pinia';
import Cookies from 'js-cookie'
import { ref, computed } from 'vue';
import { getConfig } from "@/config";

export const useAppStore = defineStore('app', () => {
  const state = ref({
    // sidebarOpened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    sidebarOpened: true,
    sidebarWithoutAnimation: false,
    sidebarIsClickCollapse:false,
    layout: getConfig().Layout,
    device: 'desktop'
  });

  const toggle_sidebar = () => {
    state.value.sidebarOpened = !state.value.sidebarOpened;
    state.value.sidebarWithoutAnimation = false;
    // Cookies.set('sidebarStatus', state.value.sidebarOpened ? '1' : '0');
  };

  function closeSidebar(withoutAnimation) {
    // Cookies.set('sidebarStatus', '0');
    state.value.sidebarOpened = false;
    state.value.sidebarWithoutAnimation = withoutAnimation;
  };

  function toggleDevice(newDevice) {
    state.value.device = newDevice;
  };

  const getSidebarOpened = computed(() => state.value.sidebarOpened);
  const getSidebarWithoutAnimation = computed(() => state.value.sidebarWithoutAnimation);
  const getDevice = computed(() => state.value.device);

  return {
    getSidebarOpened,
    getSidebarWithoutAnimation,
    getDevice,
    toggle_sidebar,
    closeSidebar,
    toggleDevice,
  }
}, {
  persistent: true,
})

