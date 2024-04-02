import { defineStore } from 'pinia';
import { ref, computed } from 'vue'

export const useTabStore = defineStore('tab', () => {
    // 使用 ref 创建响应式状态
    const state = ref({
        tabsOption: [
            {
                route: '/welcome',
                name: 'Welcome',
                title: '首页',
            }
        ],
        currentIndex: '/welcome'
    });


    // 定义操作函数来修改状态
    function addTab(tab) {
        state.value.tabsOption.push(tab);
    }

    function deleteTab(route) {
        const index = state.value.tabsOption.findIndex(tab => tab.route === route);
        if (index !== -1) {
            state.value.tabsOption.splice(index, 1);
        }
    }

    function setCurrentIndex(index) {
        state.value.currentIndex = index;
    }

    function clearTab() {
        state.value.tabsOption = [{
            route: "/welcome",
            name: "Welcome",
            title: "首页",
        }];
    }

    const getTabsOption = computed(() => state.value.tabsOption);
    const getCurrentIndex = computed(() => state.value.currentIndex);

    return { addTab, deleteTab, setCurrentIndex, clearTab, getTabsOption, getCurrentIndex };
}, {
    persistent: true,
});

