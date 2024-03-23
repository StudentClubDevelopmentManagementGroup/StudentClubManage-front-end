<script setup lang="ts">
import { ref } from "vue";
import { Setting } from "@element-plus/icons-vue";

const props = defineProps({
  buttonTop: {
    type: Number,
    default: 250,
  },
});

const openDrawer = ref(false);
</script>

<template>
  <div class="rightDrawer">
    <el-drawer v-model="openDrawer" size="20%" :with-header="false">
      <div class="slot-body">
        <slot />
      </div>
    </el-drawer>
    <div class="rightPanel">
      <el-button
        class="handle-button"
        type="primary"
        :class="{ 'handle-button-close': !openDrawer }"
        :style="{ top: buttonTop + 'px' }"
        @click="openDrawer = !openDrawer"
      >
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rightDrawer {
  .slot-body {
    padding: 20px;
  }
}

.rightPanel {
  width: 100%;
  max-width: 350px;
  height: 100vh;
  position: fixed;
  padding: 24px;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 2000;

  .handle-button {
    width: 48px;
    height: 48px;
    position: absolute;
    left: -48px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .handle-button-close {
    left: -8px;
    &:hover {
      left: -48px;
    }
  }
}
</style>
