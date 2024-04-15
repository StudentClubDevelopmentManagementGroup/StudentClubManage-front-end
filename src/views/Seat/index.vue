<script setup lang="ts">
import demoData from "./data.json";
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import LogicFlow from "@logicflow/core";
import { ref, unref, onMounted } from "vue";
import {
  nodeList,
  SeatModel,
  SeatView,
} from "@/components/FlowChart/src/config";
import { Snapshot, BpmnElement, Menu } from "@logicflow/extension";
import { Control, NodePanel, DataDialog ,Property} from "@/components/FlowChart";

defineOptions({
  name: "FlowChart",
});

const lf = ref(null);
const graphData = ref(null);
const dataVisible = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const clickNode = ref(null);
const config = ref({
  grid: true,
  background: {
    color: "#f7f9ff",
  },
  adjustEdge: false,
  keyboard: {
    enabled: true,
  },
});

function initLf() {
  // 画布配置
  LogicFlow.use(Snapshot);
  // 使用bpmn插件，引入bpmn元素
  LogicFlow.use(BpmnElement);
  // 启动右键菜单
  LogicFlow.use(Menu);
  const domLf = new LogicFlow({
    ...unref(config),
    container: document.querySelector("#LF-view"),
  });
  lf.value = domLf;
  lf.value.register({
    type: "seat",
    view: SeatView,
    model: SeatModel,
  });
  // 设置边类型bpmn:sequenceFlow为默认类型
  unref(lf).setDefaultEdgeType("bpmn:sequenceFlow");
  onRender();
}

function onRender() {
  const lFData = demoData;
  lf.value.render(lFData);

  lf.value.on("node:click", ({ data }) => {
    console.log("node:click", data);
    clickNode.value = data;
    dialogVisible.value = true;
  });
  // lf.value.on("element:click", () => {
  //   hideAddPanel();
  // });
  lf.value.on("edge:add", ({ data }) => {
    console.log("edge:add", data);
  });
  // lf.value.on("node:mousemove", ({ data }) => {
  //   console.log("node:mousemove");
  //   moveData = data;
  // });
  // lf.value.on("blank:click", () => {
  //   hideAddPanel();
  // });
  lf.value.on("connection:not-allowed", (data) => {
    console.log(data.msg);
  });
  lf.value.on("node:mousemove", () => {
    console.log("on mousemove");
  });
}

const closeDialog = () => {
  dialogVisible.value = false;
};

function catData() {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
}

onMounted(() => {
  initLf();
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          流程图组件，采用开源的
          <el-link
            href="https://site.logic-flow.cn/docs/#/zh/guide/start"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            LogicFlow
          </el-link>
        </span>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/flow-chart"
        target="_blank"
      >
        代码位置 src/views/flow-chart
      </el-link>
    </template>
    <div class="logic-flow-view">
      <!-- 辅助工具栏 -->
      <Control
        v-if="lf"
        class="demo-control"
        :lf="lf"
        :catTurboData="false"
        @catData="catData"
      />
      <!-- 节点面板 -->
      <NodePanel v-if="lf" :lf="lf" :nodeList="nodeList" />
      <!-- 画布 -->
      <div id="LF-view" />

      <el-drawer
        title="设置座位属性"
        v-model="dialogVisible"
        direction="rtl"
        size="500px"
        :before-close="closeDialog"
      >
        <Property
          v-if="dialogVisible"
          :nodeData="clickNode"
          :lf="lf"
          @setPropertiesFinish="closeDialog"
        ></Property>
      </el-drawer>

      <!-- 数据查看面板 -->
      <el-dialog
        v-model="dataVisible"
        class="flow-dialog"
        title="数据"
        width="50%"
      >
        <el-scrollbar>
          <DataDialog :graphData="graphData" />
        </el-scrollbar>
      </el-dialog>
    </div>
  </el-card>
</template>

<style scoped>
#LF-view {
  width: 100%;
  height: 65vh;
}

.logic-flow-view {
  position: relative;
  margin: 10px;
}

.demo-title {
  margin: 20px;
  text-align: center;
}

.demo-control {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 2;
}

.time-plus {
  cursor: pointer;
}

.add-panel {
  position: absolute;
  z-index: 11;
  padding: 10px 5px;
  background-color: white;
}

.el-drawer__body {
  z-index: 3;
  height: 80%;
  margin-top: -30px;
  overflow: auto;
}

:deep(.flow-dialog) {
  position: relative;
  top: 5vh;
  left: 0;
  margin: 0 auto;
  transform: none;
}

:deep(.flow-dialog) .el-dialog__body {
  height: 85vh;
  overflow: auto;
}
</style>
