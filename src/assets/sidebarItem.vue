<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import linkItem from "./linkItem.vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNested: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: "",
  },
});

const onlyOneChild = ref(null);

const basePath = computed(() => props.basePath);

onMounted(() => {
  console.log("basePath.value", basePath.value);
});

const hasOneShowingChild = (children, parent) => {
  if (children) {
    const showingChildren = children.filter((item) => {
      if (item?.hidden) {
        return false;
      } else {
        onlyOneChild.value = item;
        return true;
      }
    });

    if (showingChildren.length === 1) {
      return true;
    }

    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, noShowingChildren: true };
      return true;
    }
  }

  return false;
};
</script>

<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!--only on child show el-menu -->
    <template
      v-if="hasOneShowingChild(item.children, item) && !onlyOneChild.children"
    >
      <!-- <link-item> -->
      <el-menu-item
        :key="onlyOneChild.path"
        :index="onlyOneChild.path"
        :route="onlyOneChild.path"
      >
        <IconifyIconOnline :icon="toRaw(onlyOneChild.meta.icon)" />
        <template #title>{{ onlyOneChild.meta.title }}</template>
      </el-menu-item>
      <!-- </link-item> -->
    </template>
    <el-sub-menu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template #title>
        <IconifyIconOnline :data-index="item.path" :icon="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <!--children 进行递归调用自身组件-->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="child.path"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
