<script setup>
import { computed } from "vue";
import useStore from "@/store";
import avatar from "@/assets/avatar-default.png";

const userInfo = computed(() => useStore.userStore.getUserInfo);
const roles = computed(() => useStore.userStore.getRoles);

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
</script>

<template>
  <el-row v-if="userInfo" :gutter="20">
    <el-col :span="10">
      <el-card class="user-card" shadow="hover">
        <div
          style="padding-left: 20px; padding-right: 20px"
          class="user-card-body"
        >
          <div style="text-align: center">
            <el-avatar :size="100" :src="avatar" />
          </div>
          <div
            style="
              font-size: 20px;
              font-weight: bold;
              text-align: center;
            "
          >
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="user-info">
            <div>
              <span
                >角色：<el-tag
                  v-for="role in roleArray"
                  :key="role"
                  type="primary"
                >
                  {{ role }}
                </el-tag></span
              >
            </div>
            <div class="pt-3.5">
              <span
                >学号/工号：{{ userInfo.user_id }}</span
              >
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
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <!-- <el-card shadow="hover">
        <div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="info">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="85px"
              >
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="学号/工号" prop="stuNum">
                  <el-input v-model="ruleForm.stuNum"></el-input>
                </el-form-item>
                <el-form-item label="学院" prop="institute">
                  <el-select
                    style="width: 100%"
                    v-model="ruleForm.institute"
                    placeholder="请选择所在学院"
                  >
                    <el-option
                      :key="index"
                      v-for="(item, index) in institutes"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                  <el-input v-model="ruleForm.mail"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    :loading="btnLoading"
                    type="primary"
                    @click="handleUpdateInfo"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div style="text-align: center; color: #909399; font-size: 12px">
          <span> 注意：个人信息每24小时只允许修改1次！(*代表必填信息) </span>
        </div>
        <div
          style="
            text-align: center;
            color: #909399;
            font-size: 12px;
            margin-top: 10px;
          "
        >
          <span> 修改信息后H5端请重新登录同步个人信息！ </span>
        </div>
      </el-card> -->
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped></style>
