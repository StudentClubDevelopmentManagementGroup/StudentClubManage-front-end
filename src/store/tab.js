import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', () => {
    // 使用 ref 创建响应式状态
    const tabsOption = ref([
        {
            route: "/welcome",
            name: "Welcome",
            meta: {
                title: "首页",
            }
        }
    ]);
    const currentIndex = ref('/home');

    // 定义操作函数来修改状态
    function addTab(tab) {
        tabsOption.value.push(tab);
    }

    function deleteTab(route) {
        const index = tabsOption.value.findIndex(tab => tab.route === route);
        if (index !== -1) {
            tabsOption.value.splice(index, 1);
        }
    }

    function setCurrentIndex(index) {
        currentIndex.value = index;
    }

    function clearTab() {
        tabsOption.value = ref([{
            route: "/welcome",
            name: "Welcome",
            meta: {
                title: "首页",
            }
        }

        ])
    }
    // 返回状态和操作函数
    return { tabsOption, currentIndex, addTab, deleteTab, setCurrentIndex, clearTab };
}, {
    persistent: true,
});

