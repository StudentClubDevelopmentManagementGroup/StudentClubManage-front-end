<script setup lang="ts">
import { ref, computed } from "vue";
import { userUpdatePwdRules } from "./utils/rule";
import { userProps } from "./utils/types";
import useStore from "@/store";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<userProps>(), {
  formInline: () => ({
    pwd: "",
    rePwd: "",
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const defaultPwd = computed(() => useStore.publicStore.getDefaultPwd());
const radioStatus = ref(true);

const handleBtnChange = (val) => {
  useStore.publicStore.setPwd(val);
};

const handleRadioChange = (val) => {
  useStore.publicStore.setRadioStatus(val);
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="userUpdatePwdRules">
    <el-row :gutter="32">
      <re-col>
        <el-form-item label="重置密码">
          <el-radio-group v-model="radioStatus" @change="handleRadioChange">
            <el-radio :value="true">预设密码</el-radio>
            <el-radio :value="false">自定义密码</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="预设密码">
          <el-text :type="radioStatus ? 'primary' : 'info'">{{ defaultPwd }}</el-text>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="新密码" prop="pwd">
          <el-input
            v-model="newFormInline.pwd"
            placeholder="请输入用户新密码"
            clearable
            show-password
            :disabled="radioStatus"
            @change="handleBtnChange"
          ></el-input>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="确认密码" prop="rePwd">
          <el-input
            v-model="newFormInline.rePwd"
            placeholder="请再次输入用户新密码"
            clearable
            show-password
            :disabled="radioStatus"
          ></el-input>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped></style>
