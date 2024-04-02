<script setup>
import { ref, reactive } from "vue";
import { registRules } from "../utils/rule";
import { useRouter, useRoute } from "vue-router";
import useStore from "@/store";
import departmentApi from "@/api/department";

import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
// import Card from "@iconify-icons/ri/id-card-fill";
import School from "@iconify-icons/ri/school-fill";
import Mail from "@iconify-icons/ri/mail-fill";
import Code from "@iconify-icons/ri/shield-keyhole-line";

const route = useRoute();
const router = useRouter();

const checked = ref(false);
const loading = ref(false);
const registForm = reactive({
  name: "",
  userId: "",
  departmentId: "",
  mail: "",
  code: "",
  pwd: "",
});

const department = ref({});

const getDepartment = () => {
  departmentApi
    .getAllDepartment()
    .then((data) => {
      department.value = data;
      console.log(data);
    })
    .catch((e) => {
      console.log(e.message);
    });
};
const handleRegist = () => {
  P;
};
const onBack = () => {
  useStore.userStore.setCurrentPage(0);
};
getDepartment()
</script>

<template>
  <el-divider class="!mb-6">
    <p class="text-gray-500 text-lg">注册</p>
  </el-divider>
  <el-form
    :rules="registRules"
    ref="registFormRef"
    class="regist_form"
    :model="registForm"
  >
    <el-form-item prop="name">
      <el-input v-model="registForm.name" clearable placeholder="请输入姓名">
        <template #prefix>
          <IconifyIconOffline
            :icon="User"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="userId">
      <el-input
        placeholder="请输入工号/学号"
        v-model="registForm.userId"
        clearable
      >
        <template #prefix>
          <IconifyIconOnline
            icon="ri:id-card-fill"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
          <!-- <IconifyIconOffline
            :icon="Id"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          /> -->
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="departmentId">
      <el-select
        v-model="registForm.departmentId"
        placeholder="请选择学院"
        style="width: 240px"
      >
        <template #prefix>
          <IconifyIconOffline
            :icon="School"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
        <el-option
          v-for="item in department"
          :key="item.id"
          :label="item.fullName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

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
      <div class="w-full flex justify-between">
        <el-button
          type="primary"
          @click.native.prevent="handleRegist"
          class="w-full"
          :loading="loading"
        >
          注册
        </el-button>
        <el-button class="w-full" size="default" @click="onBack">
          返回登录
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
