<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { emailProps, emailUpdatedRules } from "./hook.tsx";
import userApi from "@/api/user";

import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<emailProps>(), {
  formInline: () => ({
    code: "",
    email: "",
    userId: "",
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const keyStartTime = "cst";
const countFlag = 60;

const btnLoading = ref(false);
const disabled = ref(false);
const buttonText = ref("发送验证码");
const intervalId = ref(null);
const isCounting = ref(false);
const remainingTime = ref(countFlag);

// 从 localStorage 获取开始时间戳（毫秒）
function getStartTimeFromLocalStorage(key) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? parseInt(item, 10) : null;
  } catch (error) {
    console.error("获取localStorage时抛出异常:", error);
    return null;
  }
}

// 保存到 localStorage
function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value.toString());
  } catch (error) {
    console.error("保存localStorage时抛出异常:", error);
  }
}

// 删除 localStorage
function removeFromLocalStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("删除localStorage时抛出异常:", error);
  }
}

const startCountdown = () => {
  if (isCounting.value) return;

  if (!getStartTimeFromLocalStorage(keyStartTime)) {
    saveToLocalStorage(keyStartTime, Date.now()); // 记录与上一次计时器开始的时间不重叠的新计时器的开始时间
  }

  isCounting.value = true;
  disabled.value = true;
  buttonText.value = `${remainingTime.value}秒后重发`;
  intervalId.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1;
      buttonText.value = `${remainingTime.value}秒后重发`;
    } else {
      removeFromLocalStorage(keyStartTime);
      clearInterval(intervalId.value);
      isCounting.value = false;
      remainingTime.value = countFlag;
      disabled.value = false;
      buttonText.value = "发送验证码";
    }
  }, 1000);
};

const stopCountdown = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    isCounting.value = false;
  }
};

const handleBtnStatus = () => {
  // 处理点击过后的按钮计时器事件
  const startTime = getStartTimeFromLocalStorage(keyStartTime);
  if (!startTime) return;

  const elapsedTime = Date.now() - startTime; // 计算已过去的时间（毫秒）
  const elapsedSeconds = Math.ceil(elapsedTime / 1000); // 转换为秒数

  if (elapsedSeconds >= countFlag) {
    // 距离上一次计时器启动超过 countFlag 的倒计时
    // 按钮状态初始化为最初状态 —— 无动作
    removeFromLocalStorage(keyStartTime);
  } else {
    remainingTime.value = countFlag - elapsedSeconds;
    startCountdown();
  }
};

onMounted(() => {
  handleBtnStatus();
});

onBeforeUnmount(() => {
  stopCountdown();
});

const handleSendCode = () => {
  btnLoading.value = true;
  return new Promise((resolve, reject) => {
    userApi
      .getEmailCode(newFormInline.value.userId)
      .then((data) => {
        btnLoading.value = false;
        startCountdown();
        resolve(data);
      })
      .catch((err) => {
        startCountdown();
        btnLoading.value = false;
      });
  });
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="newFormInline" :rules="emailUpdatedRules">
      <el-row :gutter="32">
        <re-col>
          <el-form-item label="电子邮箱">
            <el-input
              class="!w-[208px]"
              v-model="newFormInline.email"
              placeholder="请输入修改的电子邮箱"
              clearable
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="验证码" prop="code">
            <el-input
              v-model="newFormInline.code"
              placeholder="请输入邮箱验证码"
              clearable
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-button
            :loading="btnLoading"
            :type="disabled ? 'info' : 'primary'"
            @click="handleSendCode"
            :disabled="disabled"
          >
            {{ buttonText }}
          </el-button>
        </re-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
