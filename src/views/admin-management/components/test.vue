<script setup>
import { defineProps } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
const { icon, title } = props;
console.log(props);
</script>

<template>
  <div style="color: red">{{ icon }}</div>
  <div style="color: blue">{{ title }}</div>
</template>

<style scoped></style>
