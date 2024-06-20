<template>
  <div>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="安排者：">
        <el-tag type="primary">{{
          formData.arranger.user_id + formData.arranger.name
        }}</el-tag>
        <el-tag
          v-if="formData.arranger.is_teacher"
          style="margin-left: 10px"
          type="success"
          >教师</el-tag
        >
        <el-tag
          v-if="formData.arranger.is_student"
          style="margin-left: 10px"
          type="info"
          >学生</el-tag
        >
      </el-form-item>
      <el-form-item label="拥有者：">
        <el-select
          v-model="formData.user_id"
          placeholder="选择成员，未选择为空座"
          size="large"
          clearable
          style="width: 240px"
          @change="updateName"
        >
          <el-option
            v-for="item in memberData"
            :key="item.user_id"
            :label="item.user_id + item.name"
            :value="item.user_id"
          />
          <Pagination
            v-show="total > 0"
            :total="total"
            :page="page"
            :limit="size"
            :small="true"
            layout="prev, pager, next"
            @update:page="page = $event"
            @update:limit="size = $event"
            @pagination="getMemberNoSeatData"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="formData.description"
          clearable
          placeholder="请输入座位备注"
          style="width: 90%"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref,computed } from "vue";
import Pagination from "@/components/Pagination";
import seatApi from "@/api/seat";
import { message } from "@/utils/message";
import useStore from "@/store";

const props = defineProps({
  nodeData: Object,
  lf: {
    type: Object || String,
  },
});

const page = ref(1);
const size = ref(7);
const total = ref(0);
const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
const memberData = ref([]);

const getMemberNoSeatData = () => {
  seatApi
    .getMemberNoSeat(club_id.value, page.value, size.value)
    .then((data) => {
      memberData.value = data.records;
      total.value = Number(data.total_item);
    })
    .catch((e) => {
      console.error(e.message);
    });
};

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
  getMemberNoSeatData();
  const { properties } = props.nodeData;
  if (properties) {
    Object.assign(formData.value, properties);
  }
});

const updateName = (value) => {
  formData.value.name = null;
  memberData.value.forEach((item) => {
    if (item.user_id == value) {
      formData.value.name = item.name;
      return;
    }
  });
};
const onCancel = () => {
  emit("onClose");
};

const onSubmit = () => {
  const { id, x, y } = props.nodeData;
  const seat = {
    seat_id: id,
    x,
    y,
    description: formData.value.description,
    owner_id: formData.value.user_id,
    unset_owner: formData.value.user_id ? false : true,
  };
  seatApi
    .updateSeatInfo({ club_id: club_id.value, seat_list: [seat] })
    .then(() => {
      if (!formData.value.user_id) {
        formData.value.user_id = null;
      }
      console.log(formData.value);
      props.lf.setProperties(id, { ...formData.value });
      props.lf.updateText(id, formData.value.name);
      emit("onClose");
      message("保存成功", { type: "success" });
    })
    .catch(() => {
      message("保存失败", { type: "error" });
    });
};
</script>
