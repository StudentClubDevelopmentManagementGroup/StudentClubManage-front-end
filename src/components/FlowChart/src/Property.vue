<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="文案">
        <el-input v-model="formData.text"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-input v-model="formData.region"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="formData.type"></el-input>
      </el-form-item>
      <el-form-item label="A">
        <el-input v-model="formData.a.a1"></el-input>
        <el-input v-model="formData.a.a2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
  nodeData: Object,
  lf: {
    type: Object || String,
  }
});
const emit = defineEmits(['onClose']);

const text = ref('');
const formData = ref({
  text: '',
  name: '',
  region: '',
  type: '',
  a: {
    a1: '',
    a2: ''
  }
});

onMounted(() => {
  const { properties, text: nodeText } = props.nodeData;
  if (properties) {
    Object.assign(formData.value, properties);
  }
  if (nodeText && nodeText.value) {
    formData.value.text = nodeText.value;
  }
  if (nodeText && nodeText.value) {
    text.value = nodeText.value;
  }
});

const onSubmit = () => {
  const { id } = props.nodeData;
  props.lf.setProperties(id, { ...formData.value });
  props.lf.updateText(id, formData.value.text);
  emit('onClose');
};


</script>

