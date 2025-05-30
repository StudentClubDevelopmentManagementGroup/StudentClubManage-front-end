<script setup lang="ts">
import { ref, computed, onMounted, toRaw, useAttrs } from "vue";
import linkItem from "./linkItem.vue";
import Text from "@/components/Text";
import path from "path";
import { isExternal } from "@/utils/validate";
import useStore from "@/store";
import { getConfig } from "@/config";

interface childType {
  path: string;
  name?: string;
  component: Function;
  meta: {
    title: Object;
    icon: string;
    hidden?: boolean;
    [key: string]: any;
  };
}

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

const attrs = useAttrs();

const onlyOneChild = ref(null);
const isCollapse = computed(() => !useStore.appStore.getSidebarOpened);
const layout = computed(() => useStore.appStore.getLayout);

const getDivStyle = computed(() => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  };
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    width: "100%",
    display: "flex",
    alignItems: "center",
  };
});

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin:
      layout.value === "horizontal"
        ? "0 5px 0 0"
        : isCollapse.value
        ? "0 auto"
        : "0 5px 0 0",
  };
});

const hasOneShowingChild = (children: childType[] = [], parent: any) => {
  // if (children) {
  const showingChildren = children.filter((item) => {
    if (item?.meta?.hidden) {
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
  // }

  return false;
};

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
};
</script>

<template>
  <link-item
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
    :to="onlyOneChild.path"
    v-bind="attrs"
  >
    <el-menu-item
      :key="onlyOneChild.path"
      :index="onlyOneChild.path"
      :route="onlyOneChild.path"
      :class="{ 'submenu-title-noDropdown': !isNested }"
      :style="getNoDropdownStyle"
      v-bind="attrs"
    >
      <div
        v-if="toRaw(item.meta.icon)"
        class="sub-menu-icon"
        :style="getSubMenuIconStyle"
      >
        <IconifyIconOnline :icon="toRaw(onlyOneChild.meta.icon)" />
      </div>
      <template #title
        ><div :style="getDivStyle">
          <Text
            :tippyProps="{
              offset: [0, -10],
              theme: 'light',
            }"
            class="!text-inherit"
          >
            {{ onlyOneChild.meta.title }}
          </Text>
        </div></template
      >
    </el-menu-item>
  </link-item>
  <el-sub-menu
    v-else
    ref="subMenu"
    :index="item.path"
    teleported
    v-bind="attrs"
  >
    <template #title>
      <div
        v-if="toRaw(item.meta.icon)"
        class="sub-menu-icon"
        :style="getSubMenuIconStyle"
      >
        <IconifyIconOnline :data-index="item.path" :icon="item.meta.icon" />
      </div>
      <Text
        v-if="(layout === 'vertical' && !isCollapse) || layout === 'horizontal'"
        :tippyProps="{
          offset: [0, -10],
          theme: 'light',
        }"
        :class="{
          '!text-inherit': true,
          '!px-4': layout !== 'horizontal' &&isCollapse,
        }"
      >
        {{ item.meta.title }}
      </Text>
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
</template>
