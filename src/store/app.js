import { defineStore } from 'pinia';
import Cookies from 'js-cookie'

export const useAppStore = defineStore('app', () => {
  // state
  const sidebarOpened = ref(Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true)
  const sidebarWithoutAnimation = ref(false)
  const device = ref('desktop')

  // actions
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
    sidebarWithoutAnimation.value = false
    Cookies.set('sidebarStatus', sidebarOpened.value ? '1' : '0')
  }

  function closeSidebar(withoutAnimation) {
    Cookies.set('sidebarStatus', '0')
    sidebarOpened.value = false
    sidebarWithoutAnimation.value = withoutAnimation
  }

  function toggleDevice(newDevice) {
    device.value = newDevice
  }

  return {
    // state
    sidebarOpened,
    sidebarWithoutAnimation,
    device,

    // actions
    toggleSidebar,
    closeSidebar,
    toggleDevice
  }
},{
    persistent: true,
})

