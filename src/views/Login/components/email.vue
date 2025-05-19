<script setup>
import { reactive, ref } from "vue";
import { registRules } from "../utils/rule";
import { useVerifyCode } from "../utils/verifyCode";
import { useRouter } from "vue-router";
import useStore from "@/store";
import userApi from "@/api/user";
import { message } from "@/utils/message";

import Code from "@iconify-icons/ri/shield-keyhole-line";
import User from "@iconify-icons/ri/user-3-fill";
const { isDisabled, text } = useVerifyCode();

const router = useRouter();

const loading = ref(false);
const emailFormRef = ref();
const emailForm = reactive({
  user_id: "",
  code: "",
});

const getCode = () => {
  useVerifyCode().start(emailFormRef.value, "user_id");
  userApi.getEmailCode(emailForm.user_id).then(() => {
    message("验证码获取成功", { type: "success" });
  });
};

const emailLogin = async () => {
  if (!emailForm) return;
  await emailFormRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useStore.userStore
        .emailLogin(emailForm)
        .then(() => {
          // 获取权限路由和权限信息
          useStore.permissionStore.getPermissionRoutes();
          useStore.permissionStore.getPermissions();
          // 导航到主页
          router.replace({ path: "/" });
          message("登陆成功", { type: "success" });
        })
        .finally(() => (loading.value = false));
    } else {
      message("表单验证失败", { type: "error" });
    }
  });
};
const onBack = () => {
  useVerifyCode().end();
  useStore.userStore.setCurrentPage(0);
};
</script>

<template>
  <el-divider class="!mb-6">
    <p class="text-gray-500 text-sm">邮箱验证码登录</p>
  </el-divider>
  <el-form
    :rules="registRules"
    ref="emailFormRef"
    class="email_form"
    :model="emailForm"
  >
    <el-form-item prop="user_id">
      <el-input placeholder="请输入学号/工号" v-model="emailForm.user_id" clearable>
        <template #prefix>
          <IconifyIconOffline
            :icon="User"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="code">
      <div class="w-full flex justify-between">
        <el-input placeholder="请输入验证码" v-model="emailForm.code" clearable>
          <template #prefix>
            <IconifyIconOffline
              :icon="Code"
              width="14"
              class="cursor-pointer text-gray-500 hover:text-blue-400"
            />
          </template>
        </el-input>
        <el-button :disabled="isDisabled" class="ml-2" @click="getCode()"
          >{{ text.length > 0 ? text : "获取验证码" }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click.native.prevent="emailLogin"
        class="w-full"
        :loading="loading"
      >
        登录
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" size="default" @click="onBack">
        使用账号密码登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
