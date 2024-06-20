<script setup>
import { computed, onMounted, ref } from "vue";
import useStore from "@/store";
import avatar from "@/assets/avatar-default.png";
import noticeApi from "@/api/announcement";

const notice = ref({});
const userInfo = computed(() => useStore.userStore.getUserInfo);
const roles = computed(() => useStore.userStore.getRoles);
const club_id = computed(() => useStore.userStore.getClubId);
const roleArray = computed(() => {
  const roleMap = {
    is_student: "学生",
    is_teacher: "教师",
    is_club_member: "社团成员",
    is_club_manager: "社团管理员",
    is_super_admin: "超级管理员",
  };

  return Object.keys(roles.value)
    .filter((role) => roles.value[role])
    .map((role) => roleMap[role]);
});

const getNowNotice = () => {
  noticeApi.getNowNotice(club_id.value).then((data) => {
    notice.value = data;
  });
};

onMounted(() => {
  getNowNotice();
});
</script>

<template>
  <el-row v-if="userInfo" :gutter="20">
    <el-col :span="10">
      <el-card class="p-4 ml-4" shadow="hover">
        <div
          style="padding-left: 20px; padding-right: 20px"
          class="user-card-body"
        >
          <div style="text-align: center">
            <el-avatar :size="100" :src="avatar" />
          </div>
          <div style="font-size: 20px; font-weight: bold; text-align: center">
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="user-info">
            <div>
              <span
                >角色：<el-tag
                  v-for="role in roleArray"
                  :key="role"
                  type="primary"
                  class="ml-2"
                >
                  {{ role }}
                </el-tag></span
              >
            </div>
            <div class="pt-3.5">
              <span>学号/工号：{{ userInfo.user_id }}</span>
            </div>
            <div class="pt-3.5">
              <span
                ><i style="margin-right: 5px" class="el-icon-school"></i
                >学院：{{ userInfo.department.department_name }}</span
              >
            </div>
            <div class="pt-3.5">
              <span
                ><i style="margin-right: 5px" class="el-icon-message"></i
                >邮箱：{{
                  userInfo.mail === null ? "未填写邮箱" : userInfo.mail
                }}</span
              >
            </div>
            <div class="pt-3.5">
              <span
                ><i style="margin-right: 5px" class="el-icon-message"></i
                >手机号：{{
                  userInfo.tel === null ? "未填写邮箱" : userInfo.tel
                }}</span
              >
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card class="p-4 mr-4" shadow="hover">
        <el-text type="danger" size="large">最新公告：</el-text>
        <div class="text-center">
          <h2>{{ notice.title }}</h2>
        </div>
        <br />
        <div>
          <span class="name">社团：{{  notice.club_name }}</span>
          &nbsp; &nbsp; &nbsp;
          <span class="name">发布时间：{{ notice.publish_time }}</span>
          &nbsp; &nbsp; &nbsp;
          <span class="name">作者：{{  notice.author_name }}</span>
        </div>
        <br />
        <div v-html="notice.content"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped></style>
