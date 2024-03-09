<script setup>
import { reactive, ref, watch } from "vue";
import bg from "@/assets/login/bg.png";
import left from "@/assets/login/left.png";

const loginForm = reactive({
  act: "",
  pwd: "",
});
const loginLoading = ref(false);
const loginFormRef = ref(null);

const validateTel = (rule, value, callback) => {
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的学号或者手机号"));
  } else {
    callback();
  }
};
const validatePwd = (rule, value, callback) => {
  if (value.length < 4 || value.length > 16) {
    callback(new Error("密码的长度在4~16之间"));
  } else {
    callback();
  }
};
const loginRules = {
  act: [
    {
      require: true,
      message: "账号不能为空",
      trigger: "blur",
      validator: validateTel,
    },
  ],
  pwd: [
    { require: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 4,
      max: 16,
      message: "密码长度为4-16个字符",
      trigger: "blur",
      validator: validatePwd,
    },
  ],
};

const handleLogin = () => {};
</script>

<template>
  <div class="login">
    <img :src="bg" class="wave" />
    <div class="form">
      <div class="left">
        <div class="top">
          <div class="title">
            <span>欢迎使用</span>
          </div>
          <div class="desc">
            <span>让社团管理更加简单</span>
          </div>
        </div>
        <div class="bottom">
          <img :src="left" />
        </div>
      </div>
      <div class="right">
        <el-form
          :rules="loginRules"
          ref="loginFormRef"
          label-width="0px"
          class="login_form"
          :model="loginForm"
        >
          <el-form-item prop="act">
            <el-input
              placeholder="请输入学号或者手机号"
              v-model="loginForm.act"
              prefix-icon="User"
            ></el-input>
          </el-form-item>

          <el-form-item prop="pwd">
            <el-input
              placeholder="请输入登录密码"
              type="password"
              v-model="loginForm.pwd"
              prefix-icon="Lock"
              show-password
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click.native.prevent="handleLogin"
              style="width: 100%"
              :loading="loginLoading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 700px;
  min-width: 700px;
  height: 65%;
  min-height: 400px;
  flex-direction: row;
  display: flex;
  justify-content: space-evenly;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 10px 5px rgba(34, 84, 142, 0.26);
}

.wave {
  position: fixed;
  height: 100%;
  width: 80%;
  left: 0;
  bottom: 0;
  z-index: -1;
  margin: 0px;
}

.left {
  width: 50%;
}

.left img {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.top {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px 20px;
  color: white;
}

.title {
  font-size: 20px;
  margin-bottom: 16px;
}

.desc {
  width: 100%;
  font-size: 22px;
  text-align: center;
}

.right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
}
</style>
