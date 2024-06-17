<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import useStore from "@/store";
import constants from "@/config";
import { useDialogForm } from "./hook.tsx";

import ReCol from "@/components/ReCol";

const avatar = `${constants.baseUrl}/club/announcement/file/get?file_id=/a/image/default-avatar.png`;
const { openDialog } = useDialogForm();

const userinfo = computed(() => useStore.userStore.getUserInfo);
const roleArray = computed(() => {
  const roleMap = {
    is_student: "学生",
    is_teacher: "教师",
    is_club_member: "社团成员",
    is_club_manager: "社团管理员",
    is_super_admin: "超级管理员",
  };
  return Object.keys(userinfo.value.role)
    .filter((role) => userinfo.value.role[role])
    .map((role) => roleMap[role]);
});

const handleClickAvatar = () => {
  console.log("点击了头像");
};

const changePhone = () => {
  console.log("修改手机号码");
};

const changeEmail = () => {
  console.log("修改密保邮箱");
};

onMounted(() => {
});
</script>

<template>
  <div class="container-width m-auto">
    <el-container class="wrapper bg-white">
      <el-aside class="!w-[250px]">
        <div class="text-center p-8">
          <el-avatar
            class="cursor-pointer"
            :size="180"
            shape="circle"
            :src="avatar"
            circle
            @click="handleClickAvatar"
          />
        </div>
        <!-- <div>底部占位符</div> -->
      </el-aside>
      <el-main>
        <el-row class="mt-20 px-8" :gutter="32">
          <re-col :value="12" :xs="24" :sm="24">
            <span class="label">用户名：</span>
            <span class="text">{{ userinfo.name }}</span>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <span class="label">学号：</span>
            <span class="text">{{ userinfo.user_id }}</span>
          </re-col>

          <re-col class="mt-8">
            <span class="label">学院：</span>
            <span class="text">{{ userinfo.department.department_name }}</span>
          </re-col>
          <!-- <re-col :value="12" :xs="24" :sm="24"> 占位符 </re-col> -->
          <re-col class="mt-8">
            <span class="label">角色：</span>
            <span class="text">
              <el-tag
                v-for="role in roleArray"
                :key="role"
                size="large"
                type="primary"
                effect="plain"
                class="mx-1"
              >
                {{ role }}
              </el-tag>
            </span>
          </re-col>

          <re-col class="mt-8">
            <span class="label">手机号：</span>
            <span class="text">{{ userinfo.tel }}</span>
            <el-button v-if="false" class="ml-4" type="primary" link @click="changePhone">
              <!-- TODO: 未开发功能 -->
              修改
            </el-button>
          </re-col>

          <re-col class="mt-8">
            <span class="label">电子邮箱：</span>
            <span class="text">{{ userinfo.mail }}</span>
            <el-button
              class="ml-4"
              type="primary"
              link
              @click="openDialog('修改邮箱', userinfo)"
            >
              修改
            </el-button>
          </re-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 786px;

  .el-col {
    color: #000;
    font-size: 20px;
    line-height: 28px;
  }

  .label {
    font-weight: 600;
  }

  .text {
  }

  ::v-deep(.el-tag__content) {
    font-size: 18px;
    line-height: 28px;
  }

  ::v-deep(.el-button > span) {
    font-size: 18px;
  }
}
</style>
