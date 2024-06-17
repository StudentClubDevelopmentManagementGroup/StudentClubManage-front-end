<script setup lang="ts">
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const props = defineProps({
  graphData: Object,
  editable: {
    type: Boolean,
    default: false,
  },
});

const select = (node) => {
  const editProps = ["x", "y", "name", "user_id", "description"];
  if (props.editable && editProps.includes(node.key)) {
    return true;
  } else {
    return false;
  }
};
</script>

<template>
  <vue-json-pretty
    :path="'res'"
    :deep="3"
    :showLength="true"
    :data="props.graphData"
    :nodeSelectable="select"
    :editable="editable"
  />
</template>
