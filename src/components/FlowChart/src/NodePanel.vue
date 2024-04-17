<script setup lang="ts">
import { ref, unref } from "vue";
import { LogicFlow } from "@logicflow/core";

type nodeListType = {
  text: string;
  class: string;
  type: string;
};

interface Props {
  lf: LogicFlow;
  nodeList: Array<nodeListType>;
}

const props = withDefaults(defineProps<Props>(), {
  lf: null,
  nodeList: null,
});

const properties = ref({
  a: "efrwe",
  b: "wewe",
});

const nodeDragNode = (item) => {
  props.lf.dnd.startDrag({
    type: item.type,
    properties: unref(properties),
  });
};
</script>

<template>
  <!-- 左侧bpmn元素选择器 -->
  <div class="node-panel">
    <div
      v-for="item in props.nodeList"
      :key="item.text"
      class="node-item dark:text-bg_color"
      @mousedown="nodeDragNode(item)"
    >
      <div class="node-item-icon" :class="item.class">
        <div class="shape" />
      </div>
      <span class="node-label">{{ item.text }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node-panel {
  position: absolute;
  top: 10px;
  z-index: 101;
  width: 70px;
  padding: 20px 10px;
  text-align: center;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 0 10px 1px rgb(228 224 219);
}

.node-item-icon {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 38px;
  background-size: cover;
  cursor: grab;
}

.node-label {
  margin-top: 5px;
  font-size: 12px;
  user-select: none;
}

.node-rect {
  border: 2px solid $menuActiveBefore;
}
</style>
