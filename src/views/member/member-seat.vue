<script setup lang="ts">
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { toMemberNodeData } from "@/components/FlowChart/src/adpter";
import LogicFlow from "@logicflow/core";
import { ref, unref, onMounted } from "vue";
import { MemberModel, MemberView } from "@/components/FlowChart/src/config";
import { Snapshot, MiniMap } from "@logicflow/extension";
import seatApi from "@/api/seat";
import { Control, DataDialog } from "@/components/FlowChart";

const club_id = ref(1)
const lf = ref(null);
const graphData = ref(null);
const dataVisible = ref<boolean>(false);
const config = ref({
  grid: true,
  background: {
    color: "#f7f9ff",
  },
  adjustEdge: false,
  keyboard: {
    enabled: true,
  },
  isSilentMode: true,
});

function initLf() {
  // 画布配置
  LogicFlow.use(Snapshot);
  LogicFlow.use(MiniMap);
  const domLf = new LogicFlow({
    ...unref(config),
    container: document.querySelector("#LF-view"),
  });
  lf.value = domLf;
  lf.value.register({
    type: "seat",
    view: MemberView,
    model: MemberModel,
  });
  onRender();
}

async function onRender() {
  const saetData = await seatApi.getAllSeat(club_id.value);
  const lFData = toMemberNodeData(saetData);

  lf.value.render(lFData);
}

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
    <div class="logic-flow-view">
      <!-- 辅助工具栏 -->
      <Control
        v-if="lf"
        class="demo-control"
        :lf="lf"
        :catTurboData="false"
        @catData="catData"
      />
      <!-- 画布 -->
      <div id="LF-view" />

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
