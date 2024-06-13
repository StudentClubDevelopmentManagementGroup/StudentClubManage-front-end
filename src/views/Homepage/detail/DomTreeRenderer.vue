<script setup>
import { computed } from "vue";
import myImage from "@/components/Image";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const currentNode = props.node;

const currentNodeStyle = computed(() => {
  return currentNode.element.style ? currentNode.element.style.cssText : "";
});

const currentNodeInnerHTML = computed(() => {
  return currentNode.element.innerHTML || "";
});

const imgStyle = computed(() => {
  if (currentNode.element.tagName === "IMG") {
    return currentNode.element.style ? currentNode.element.style.cssText : "";
  }
  return "";
});
</script>

<template>
  <my-image
    v-if="currentNode.element?.tagName === 'IMG'"
    :src="currentNode.element.src"
    :alt="currentNode.element.alt"
    :style="imgStyle"
    :container-style="currentNode.element.containerStyle"
    :image-preview="currentNode.element.imagePreview"
  />
  <component
    v-else-if="currentNode.containImg"
    :is="currentNode.element.tagName"
    :style="currentNodeStyle"
  >
    <dom-tree-renderer
      v-for="(child, index) in currentNode.children"
      :key="index"
      :node="child"
    />
  </component>
  <component
    v-else
    :is="currentNode.element.tagName"
    :style="currentNode.element.style?.cssText"
    v-html="currentNodeInnerHTML"
  >
  </component>
</template>
