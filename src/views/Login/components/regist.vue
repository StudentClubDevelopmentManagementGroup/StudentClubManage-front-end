<script setup>
import { ref, reactive } from "vue";
import { registRules } from "../utils/rule";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/user";

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

const options = reactive([
  { id: 1, department: "Computer Science" },
  { id: 2, department: "Mechanical Engineering" },
  { id: 3, department: "Electrical Engineering" },
]);
const handleRegist = () => {
  P;
};

const onBack = () => {
  useUserStore().setCurrentPage(0);
};
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
          <IconifyIcon
            icon="ri:user-3-fill"
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
          <IconifyIcon
            icon="ri:id-card-fill"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
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
          <IconifyIcon
            icon="ri:school-fill"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.department"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="mail">
      <el-input placeholder="请输入邮箱" v-model="registForm.mail" clearable>
        <template #prefix>
          <IconifyIcon
            icon="ri:mail-fill"
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
            <IconifyIcon
              icon="ri:shield-keyhole-line"
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
          <IconifyIcon
            icon="ri:lock-fill"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="pwd">
      <el-input placeholder="确认密码" v-model="registForm.pwd" clearable>
        <template #prefix>
          <IconifyIcon
            icon="ri:lock-fill"
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
          :loading="loginLoading"
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
