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
    theme: getConfig().Theme,
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

  const setSidebarOpened = (value) => {
    state.value.sidebarOpened = value;
  };
  
  const setSidebarWithoutAnimation = (value) => {
    state.value.sidebarWithoutAnimation = value;
  };
  
  const setSidebarIsClickCollapse = (value) => {
    state.value.sidebarIsClickCollapse = value;
  };
  
  const setTheme = (value) => {
    state.value.theme = value;
  };
  
  const setDevice = (value) => {
    state.value.device = value;
  };

  function setLayout(layout){
    state.value.layout = layout;
  };
  const getSidebarOpened = computed(() => state.value.sidebarOpened);
  const getSidebarWithoutAnimation = computed(() => state.value.sidebarWithoutAnimation);
  const getLayout = computed(() => state.value.layout);
  const getDevice = computed(() => state.value.device);
  const getTheme = computed(() => state.value.theme);
  
  return {
    getSidebarOpened,
    getSidebarWithoutAnimation,
    getLayout,
    getDevice,
    getTheme,
    setLayout,
    setTheme,
    toggle_sidebar,
    closeSidebar,
    toggleDevice,
  }
}, {
  persistent: true,
})

