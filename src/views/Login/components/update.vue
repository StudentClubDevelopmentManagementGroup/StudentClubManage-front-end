<script setup>
import { reactive } from "vue";
import { registRules } from "../utils/rule";
import useStore from "@/store";

import Lock from "@iconify-icons/ri/lock-fill";
import Mail from "@iconify-icons/ri/mail-fill";
import Code from "@iconify-icons/ri/shield-keyhole-line";

const registForm = reactive({
  name: "",
  userId: "",
  departmentId: "",
  mail: "",
  code: "",
  pwd: "",
});
const onBack = () => {
  useStore.userStore.setCurrentPage(0);
};
</script>

<template>
  <el-divider class="!mb-6">
    <p class="text-gray-500 text-base">忘记密码</p>
  </el-divider>
  <el-form
    :rules="registRules"
    ref="registFormRef"
    class="regist_form"
    :model="registForm"
  >
    <el-form-item prop="mail">
      <el-input placeholder="请输入邮箱" v-model="registForm.mail" clearable>
        <template #prefix>
          <IconifyIconOffline
            :icon="Mail"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="code">
      <div class="w-full flex justify-between">
        <el-input
          placeholder="请输入验证码"
          v-model="registForm.code"
          clearable
        >
          <template #prefix>
            <IconifyIconOffline
              :icon="Code"
              width="14"
              class="cursor-pointer text-gray-500 hover:text-blue-400"
            />
          </template>
        </el-input>
        <el-button disabled="" class="ml-2" @click=""> 获取验证码 </el-button>
      </div>
    </el-form-item>

    <el-form-item prop="pwd">
      <el-input placeholder="请输入密码" v-model="registForm.pwd" clearable>
        <template #prefix>
          <IconifyIconOffline
            :icon="Lock"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="pwd">
      <el-input placeholder="确认密码" v-model="registForm.pwd" clearable>
        <template #prefix>
          <IconifyIconOffline
            :icon="Lock"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click.native.prevent=""
        class="w-full"
        :loading="loading"
      >
        确定
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" size="default" @click="onBack">
        返回
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
