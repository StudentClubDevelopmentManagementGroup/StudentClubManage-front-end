<script setup>
import { ref, reactive } from "vue";
import { registRules } from "../utils/rule";
import useStore from "@/store";
import departmentApi from "@/api/department";
import userApi from "@/api/user";
import { message } from "@/utils/message";
import { useVerifyCode } from "../utils/verifyCode";

import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
// import Card from "@iconify-icons/ri/id-card-fill";
import School from "@iconify-icons/ri/school-fill";
import Mail from "@iconify-icons/ri/mail-fill";
import Code from "@iconify-icons/ri/shield-keyhole-line";
import Phone from "@iconify-icons/ri/phone-fill";
const { isDisabled, text } = useVerifyCode();

const registFormRef = ref();
const loading = ref(false);
const registForm = reactive({
  name: "",
  user_id: "",
  department_id: "",
  mail: "",
  tel: "",
  pwd: "",
  newPwd: "",
  register_code: "",
  role: "student",
});

const department = ref({});

const getDepartment = async () => {
  await departmentApi
    .getAllDepartment()
    .then((data) => {
      department.value = data;
    })
    .catch((e) => {
      console.error(e.message);
    });
};
const handleRegist = async () => {
  loading.value = true;
  try {
    if (!registFormRef.value) throw new Error("Form reference is undefined");

    const valid = await registFormRef.value.validate();
    if (!valid) throw new Error("Validation failed");

    const data = await userApi.regist(registForm);
    message("注册成功", { type: "success" });
    onBack();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码不能为空"));
      } else if (registForm.pwd !== value) {
        callback(new Error("必须与密码一致"));
      } else {
        callback();
      }
    },
    trigger: "blur",
  },
];

const onBack = () => {
  useStore.userStore.setCurrentPage(0);
};
getDepartment();

const getCode = () => {
  useVerifyCode().start(registFormRef.value, "mail");
  userApi.registCode(registForm.mail).then(() => {
    message("验证码获取成功", { type: "success" });
  });
};
</script>

<template>
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

    <el-form-item prop="user_id">
      <el-input
        placeholder="请输入工号/学号"
        v-model="registForm.user_id"
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

    <el-form-item prop="department_id">
      <el-select
        v-model="registForm.department_id"
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

    <el-form-item prop="tel">
      <el-input placeholder="请输入电话号码" v-model="registForm.tel" clearable>
        <template #prefix>
          <IconifyIconOffline
            :icon="Phone"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
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

    <el-form-item prop="register_code">
      <div class="w-full flex justify-between">
        <el-input placeholder="请输入验证码" v-model="registForm.register_code" clearable>
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

    <el-form-item prop="pwd">
      <el-input
        placeholder="请输入密码"
        v-model="registForm.pwd"
        clearable
        show-password
      >
        <template #prefix>
          <IconifyIconOffline
            :icon="Lock"
            width="14"
            class="cursor-pointer text-gray-500 hover:text-blue-400"
          />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item :rules="repeatPasswordRule" prop="newPwd">
      <el-input
        placeholder="确认密码"
        v-model="registForm.newPwd"
        clearable
        show-password
      >
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
