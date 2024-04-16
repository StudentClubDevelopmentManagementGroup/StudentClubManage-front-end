<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="安排者">
        <el-tag type="primary">{{
          formData.arranger.user_id + formData.arranger.name
        }}</el-tag>
        <el-tag v-if="formData.arranger.is_teacher" type="success">教师</el-tag>
        <el-tag v-if="formData.arranger.is_student" type="info">学生</el-tag>
      </el-form-item>
      <el-form-item label="拥有者">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import seatApi from '@/api/seat'

const props = defineProps({
  nodeData: Object,
  lf: {
    type: Object || String,
  },
});

const emit = defineEmits(["onClose"]);


const formData = ref({
  arranger: {
    user_id: "",
    name: "",
    is_student: false,
    is_teacher: false,
  },
  user_id: "",
  name: "",
  description: "",
});

onMounted(() => {
  const { properties, text: nodeText } = props.nodeData;
  if (properties) {
    Object.assign(formData.value, properties);
  }
});

const onCancel = () => {
  emit("onClose");
};

const onSubmit = () => {
  const { id } = props.nodeData;
  props.lf.setProperties(id, { ...formData.value });
  props.lf.updateText(id, formData.value.text);
  emit("onClose");
};
</script>
