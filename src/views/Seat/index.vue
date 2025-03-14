<script setup lang="ts">
import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { ref, unref, onMounted, computed } from "vue";
import { toNodeData, toSeatData } from "@/components/FlowChart/src/adpter";
import LogicFlow from "@logicflow/core";
import { exportExcel } from "@/utils/export.ts";
import { Snapshot, Menu, MiniMap } from "@logicflow/extension";
import {
  nodeList,
  SeatModel,
  SeatView,
} from "@/components/FlowChart/src/config";
import { message } from "@/utils/message";
import {
  Control,
  NodePanel,
  DataDialog,
  Property,
} from "@/components/FlowChart";
import useStore from "@/store";
import seatApi from "@/api/seat";
import { EditPen, Plus, Download, Star } from "@element-plus/icons-vue";

const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
const lf = ref(null);
const graphData = ref(null);
const dataVisible = ref<boolean>(false);
const editable = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
const clickNode = ref({});
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

const currentUser = computed(() => {
  return {
    user_id: useStore.userStore.getUserInfo.user_id,
    name: useStore.userStore.getName,
    is_teacher: useStore.userStore.getRoles.is_teacher,
    is_student: useStore.userStore.getRoles.is_student,
  };
});

function initLf() {
  // 画布配置
  LogicFlow.use(Snapshot);
  // 使用bpmn插件，引入bpmn元素
  LogicFlow.use(MiniMap);
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
  onRender();
}

async function onRender() {
  //重写Lf右键菜单
  lf.value.setMenuConfig({
    nodeMenu: [
      {
        text: "删除",
        callback(node) {
          lf.value.deleteNode(node.id);
        },
      },
      {
        text: "编辑文本",
        callback: function (node) {
          lf.value.graphModel.editText(node.id);
        },
      },
    ],
    edgeMenu: false,
    graphMenu: [],
  });

  const seatData = await seatApi.getAllSeat(club_id.value);
  const lFData = toNodeData(seatData);
  lf.value.render(lFData);

  //监听点击事件
  lf.value.on("node:click", ({ data }) => {
    clickNode.value = data;
    dialogVisible.value = true;
  });
  //监听拖拽结束
  lf.value.on("node:drop", ({ data }) => {
    console.log("node:drop", data);
  });
  //监听拖拽增加节点事件
  lf.value.on("node:dnd-add", ({ data }) => {
    const { id, x, y } = data;
    seatApi
      .addSeat({
        club_id: club_id.value,
        seat_list: [
          {
            x,
            y,
            description: "",
          },
        ],
      })
      .then((res_data) => {
        lf.value.setProperties(id, { arranger: { ...currentUser.value } });
        lf.value.changeNodeId(id, res_data[0].seat_id);
        message("添加成功", { type: "success" });
      })
      .catch(() => {
        message("添加失败", { type: "error" });
        lf.value.undo();
      });
  });
  lf.value.on("node:delete", ({ data }) => {
    seatApi
      .delSeat({ club_id: club_id.value, seat_id: data.id })
      .then(() => {
        message("删除成功", { type: "success" });
      })
      .catch(() => {
        message("删除失败", { type: "error" });
        lf.value.undo();
      });
  });
}

const closeDialog = () => {
  dialogVisible.value = false;
  clickNode.value = {};
};

function catData() {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
  editable.value = false;
}

const saveAllSeat = () => {
  const seat_list = toSeatData(lf.value.getGraphData().nodes);
  seatApi
    .updateSeatInfo({ club_id: club_id.value, seat_list })
    .then(() => {
      message("保存成功", { type: "success" });
    })
    .catch(() => {
      message("保存失败", { type: "error" });
    });
};

const editSeat = () => {
  graphData.value = unref(lf).getGraphData();
  dataVisible.value = true;
  editable.value = true;
};

onMounted(() => {
  initLf();
});

const exportFile = () => {
  lf.value.getSnapshot()
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <div>
          <el-button v-ripple type="primary" :icon="EditPen" @click="editSeat"
            >编辑座位</el-button
          >
        </div>
        <div>
          <el-button v-ripple type="primary" :icon="Star" @click="saveAllSeat"
            >保存座位表</el-button
          >
          <el-button v-ripple type="primary" :icon="Download"  @click="exportFile" plain> 
            导出
          </el-button>
        </div>
      </div>
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
        size="450px"
        :before-close="closeDialog"
      >
        <Property
          v-if="dialogVisible"
          :nodeData="clickNode"
          :lf="lf"
          @onClose="closeDialog"
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
          <DataDialog :graphData="graphData" :editable="editable"/>
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
