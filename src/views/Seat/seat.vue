<template>
  <div class="layout-container" ref="refreshRef">
    <div v-if="!props.type" class="title">座位布局</div>
    <div
      v-if="items.length > 0"
      class="layout"
      :class="[props.type === 2 ? 'center' : '']"
    >
      <!-- 左边y轴提示 -->
      <div class="y-column">
        <div class="item-tip"></div>
        <div v-for="(x, index) in y" :key="index" class="yitem-tip">
          第{{ x }}行
        </div>
      </div>
      <div class="right">
        <!-- 顶部x轴提示 -->
        <div class="x-row">
          <div v-for="i in x" :key="i" class="xitem-tip">第{{ i }}列</div>
        </div>
        <!-- 矩形 纵向布局-->
        <div class="rectangle-y">
          <div v-for="(row, rowX) in x" :key="row" class="x">
            <div class="y">
              <div
                v-for="(column, columnY) in y"
                :key="column"
                @click="didSeletedItemAction($event, rowX, columnY)"
                :class="[
                  'site-item',
                  !_map.get(`${rowX},${columnY}`) && 'site-item-none',
                ]"
                @mouseenter="mouseenter"
                @mouseleave="mouseLeave"
              >
                {{ filterIntem(rowX, columnY) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <i class="none">{{ items.length }}</i>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

type ExamSiteType = {
  coordinateX: number; //x坐标位置
  coordinateY: number; //y坐标位置
  seatNo: number; //座位号  == 如果没有赋值为无座
};

const props = defineProps<{
  items?: Array<ExamSiteType>; //数据源
  type?: number; //1不能编辑 2可标记无座有座 3可拖拽座位
  x?: number; //可不传根据坐标算出最大值x坐标
  y?: number;
  callBack?: (x: number, y: number, type: "add" | "deleted") => void; //当为拖拽状态需要回调给数据源 删除/添加座位
  map?: Map<string, ExamSiteType>;
}>();

const items = ref<Array<ExamSiteType>>([]);
watchEffect(async () => {
  if (props.items) items.value = props.items;
});

const _map = computed(() => {
  if (props.map) {
    return props.map;
  }
  const map: Map<string, ExamSiteType> = new Map();
  items.value.forEach((item) => {
    map.set(`${item.coordinateX},${item.coordinateY}`, item);
  });
  return map;
});

const mouseenter = (event: MouseEvent) => {
  const ele = event.currentTarget as HTMLDivElement;
  if (props.type != 2) {
    return;
  }
  if (ele) {
    const text = ele.textContent;
    if (text === "") {
      ele.innerHTML = "标记</br>无座";
      ele.style.color = "#FFFFFF";
    }
    if (text === "无座") {
      ele.innerHTML = "标记</br>有座";
      ele.style.color = "#666";
    }
  }
};
const mouseLeave = (event: MouseEvent) => {
  const ele = event.currentTarget as HTMLDivElement;
  if (props.type != 2) {
    return;
  }
  if (ele) {
    const text = ele.textContent;

    if (text === "标记无座") {
      ele.textContent = "";
      ele.style.color = "#FFFFFF";
    }
    if (text === "标记有座") {
      ele.textContent = "无座";
      ele.style.color = "#CCCCCC";
    }
  }
};
const x = computed(() => {
  if (props.x) {
    return props.x;
  }
  return Math.max(...items.value.map((item) => item.coordinateX)) + 1;
});
const y = computed(() => {
  if (props.y) {
    return props.y;
  }
  return Math.max(...items.value.map((item) => item.coordinateY)) + 1;
});

const filterIntem = (x: number, y: number) => {
  if (props.type === 2) {
    //布局无编号
    return _map.value.get(`${x},${y}`) ? "" : "无座";
  }
  return _map.value.get(`${x},${y}`)?.seatNo ?? "无座";
};
// 这里当为可以标记 无座有座时候 回调给源数据 进行删除/添加
const didSeletedItemAction = (event: MouseEvent, x: number, y: number) => {
  const ele = event.currentTarget as HTMLDivElement;
  if (props.type === 2 && props.callBack) {
    if (!_map.value.get(`${x},${y}`)) {
      props.callBack(x, y, "add");
      console.log("添加...");
      ele.style.color = "#FFFFFF";
    } else {
      props.callBack(x, y, "deleted");
      ele.textContent = "无座";
      ele.style.color = "#CCCCCC";
      console.log("删除...");
    }
  }
};
</script>

<style scoped lang="scss">
.layout-container {
  margin-top: 8px;
  background-color: white;
  flex: 1;
  overflow: auto;

  .none {
    color: white;
  }

  .title {
    height: 48px;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
    font-weight: 700;
    text-align: LEFT;
    color: #333333;
    line-height: 20px;
    display: flex;
    padding-left: 20px;
    align-items: center;
  }

  .layout {
    margin: 16px;
    display: flex;

    .item-tip {
      margin-bottom: 4px;
      margin-right: 16px;
      width: 50px;
      height: 48px;
    }

    .xitem-tip {
      margin-bottom: 4px;
      margin-right: 16px;
      width: 100px;
      height: 48px;
      font-size: 16px;
      font-weight: 700;
      text-align: CENTER;
      color: #666666;
      line-height: 48px;
    }
    .yitem-tip {
      margin-bottom: 4px;
      margin-right: 16px;
      width: 50px;
      height: 80px;
      font-size: 16px;
      font-weight: 700;
      text-align: CENTER;
      color: #666666;
      line-height: 80px;
    }
    .site-item {
      width: 100px;
      height: 80px;
      background: $menuActiveBefore;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 4px;
      color: white;
      font-weight: 700;
      margin-right: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      word-wrap: break-word;

      //  &:hover {
      //      color: aqua;
      //  }
    }

    .site-item-none {
      width: 48px;
      height: 48px;
      background: rgba(102, 102, 102, 0.1);
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 4px;
      color: #cccccc;
      font-weight: 700;
      margin-right: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      word-wrap: break-word;
    }
  }

  .right {
    .x-row {
      display: flex;
      top: 0;
      position: sticky;
      background-color: white;
    }

    .rectangle-y {
      display: flex;

      .y {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
