<script setup>
import { reactive, ref, watch, toRaw } from "vue";
import bg from "@/assets/login/bg.png";
import left from "@/assets/login/left.png";
// import avatar from "@/assets/login/avatar.svg?component";
import illustration from "@/assets/login/illustration.svg?component";

const loginForm = reactive({
  act: "",
  pwd: "",
});
const loginLoading = ref(false);
const checked = ref(false);
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
    { require: true, message: "账号不能为空", trigger: "blur" },
    {
      min: 4,
      max: 16,
      message: "账号长度为6-17个字符",
      trigger: "blur",
    },
    { validator: validateTel, trigger: "blur" },
  ],
  pwd: [
    { require: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 4,
      max: 16,
      message: "密码长度为4-16个字符",
      trigger: "blur",
    },
    { validator: validatePwd, trigger: "blur" },
  ],
};

const handleLogin = () => {};
</script>

<template>
  <div class="login">
    <div class="bg">
      <img :src="bg" class="wave" />
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
    </div>
    <div class="form">
      <div class="left">
        <div class="top">
          <div class="title">
            <span>基地管理系统</span>
          </div>
          <div class="desc">
            <h4>让社团管理更加简单</h4>
          </div>
        </div>
        <div class="bottom">
          <img :src="left" />
        </div>
      </div>
      <div class="right">
        <div class="welcome">
          <span>欢迎使用基地管理系统</span>
        </div>
        <el-form
          :rules="loginRules"
          ref="loginFormRef"
          class="login_form"
          :model="loginForm"
        >
          <el-form-item prop="act">
            <el-input
              v-model="loginForm.act"
              clearable
              placeholder="请输入学号或者手机号"
            >
              <template #prefix>
                <IconifyIcon
                  icon="ri:user-3-fill"
                  width="14"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="pwd">
            <el-input
              placeholder="请输入登录密码"
              v-model="loginForm.pwd"
              clearable
              show-password
              @keyup.enter.native="handleLogin"
            >
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
            <div class="w-full h-[20px] flex justify-between items-center">
              <!-- <el-checkbox v-model="checked">
                <span class="flex">
                  7天免登录
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="勾选并登录后，规定天数内无需输入用户名和密码会自动登入系统"
                  >
                    <IconifyIcon icon="ri:information-line" width="14" />
                  </el-tooltip>
                </span>
              </el-checkbox> -->
              <el-button link @click=""> 免费注册 </el-button>
              <el-button link type="primary" @click=""> 忘记密码？ </el-button>
            </div>
            <el-button
              type="primary"
              @click.native.prevent="handleLogin"
              class="w-full mt-4"
              :loading="loginLoading"
            >
              登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider>
              <p class="text-gray-500 text-xs">快捷登陆方式</p>
            </el-divider>
            <div class="w-full flex justify-evenly">
              <span>
                <IconifyIcon
                  icon="ri:wechat-fill"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                /> </span
              ><span>
                <IconifyIcon
                  icon="ri:qq-fill"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                /> </span
              ><span>
                <IconifyIcon
                  icon="ic:baseline-email"
                  width="20"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.form {
  width: 700px;
  height: 464px;
  position: relative;
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
  width: 50%;
  position: absolute;
  padding: 20px;
  color: white;
}

.title {
  font-size: 15px;
  margin-bottom: 10px;
}

.desc {
  width: 100%;
  font-size: 22px;
  text-align: center;
}

.welcome {
  font-size: 20px;
  font-family: "STKaiTi";
  margin-bottom: 20px;
}

.right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 30px;
}
</style>
