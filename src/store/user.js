import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {

  const state = reactive({
    currentPage: 0,
  })

  const setCurrentPage = (value) => {
    state.currentPage = value;
  }


  return {
    state,
    setCurrentPage
  }
}, {
  persistent: true,
})
