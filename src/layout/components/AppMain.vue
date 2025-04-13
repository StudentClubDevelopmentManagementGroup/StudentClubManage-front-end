<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import useStore from "@/store";
import Footer from "./footer/index.vue";
import backTop from "@/assets/back_top.svg?component";

const hideFooter = computed(() => useStore.settingStore.getHideFooter);
const fixedHeader = computed(() => useStore.settingStore.getFixedHeader);
const hideTabs = computed(() => useStore.settingStore.getHideTabs);
const layout = computed(() => useStore.appStore.getLayout);
const route = useRoute();

// 使用 ref 获取滚动容器
const scrollbarRef = ref();
const scrollWrapper = ref<HTMLElement>();

// 动态计算容器样式
const getSectionStyle = computed(() => ({
  paddingTop: fixedHeader.value ? (hideTabs.value ? "47px" : "102px") : "0",
  minHeight: fixedHeader.value ? "auto" : `calc(100vh - ${hideTabs.value ? "47px" : "102px"})`
}));

// 确保滚动容器存在
onMounted(async () => {
  await nextTick();
  scrollWrapper.value = scrollbarRef.value?.wrap$;
});
</script>

<template>
  <section
    :class="[fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view v-slot="{ Component }">
      <template v-if="fixedHeader">
        <el-scrollbar
          ref="scrollbarRef"
          wrap-class="scrollbar-wrapper"
          view-class="scrollbar-view"
        >
          <!-- 使用函数式 target 确保元素存在 -->
          <el-backtop
            v-if="scrollWrapper"
            title="回到顶部"
            :target="() => scrollWrapper"
          >
            <backTop />
          </el-backtop>
          <div class="grow">
            <transition 
              :name="route.meta.transition || 'fade'" 
              mode="out-in"
            >
              <keep-alive v-if="$route.meta.keepAlive" :include="$route.name">
                <component
                  :is="Component"
                  :key="$route.path"
                  class="main-content"
                />
              </keep-alive>
              <component
                v-else
                :is="Component"
                :key="$route.path"
                class="main-content"
              />
            </transition>
          </div>
          <Footer v-if="!hideFooter" />
        </el-scrollbar>
      </template>

      <template v-else>
        <div class="grow">
          <transition 
            :name="route.meta.transition || 'fade'"
            mode="out-in"
          >
            <keep-alive v-if="$route.meta.keepAlive" :include="$route.name">
              <component
                :is="Component"
                :key="$route.path"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="$route.path"
              class="main-content"
            />
          </transition>
        </div>
      </template>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  height: calc(100vh - var(--header-height, 60px));
  overflow: hidden;

  .scrollbar-wrapper {
    height: 100% !important;
    overflow-x: hidden !important;
    
    .scrollbar-view {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .main-content {
    flex: 1;
    padding: 24px;
    background: #f5f7f9;
  }
}

.app-main-nofixed-header {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .grow {
    flex: 1;
    overflow-y: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
