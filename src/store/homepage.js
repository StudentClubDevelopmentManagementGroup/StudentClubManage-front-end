import { defineStore } from 'pinia';
import { reactive, watch } from 'vue'

// 所有首页相关的共享参数
export const useHomePageStore = defineStore('homepage', () => {

  const state = reactive({
    title_keyword: "", // 跨组件共享
  })

  const getTitleKeyword = () => {
    return state.title_keyword
  }

  const setTitleKeyword = (val) => {
    state.title_keyword = val
  }

  const clearTitleKeyWord = () => {
    state.title_keyword = ""
  }

  return {
    getTitleKeyword,
    setTitleKeyword,
    clearTitleKeyWord,
  }
}, {
  persistent: true,
});

