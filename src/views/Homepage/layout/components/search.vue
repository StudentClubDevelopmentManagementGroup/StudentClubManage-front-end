<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import useStore from "@/store";
import { message } from "@/utils/message";

const regex = /[^\w\s《》<>一-龥]/g; // 允许 汉字、数字、字母、《》、<>

const route = useRoute();

// TODO： 预留的搜索，暂无作用
const searchParams = reactive({
  content: "",
});
const handleInput = (value) => {
  console.log("value", value);
  if (regex.test(value)) {
    message("只允许输入汉字、数字、字母", { type: "warning", showClose: true });
    searchParams.content = value.replaceAll(regex, "");
  }
};
const handleSearch = () => {
  console.log("搜索成功", searchParams);
};
</script>

<template>
  <div id="container">
    <div id="wrapper">
      <el-input
        @input="handleInput"
        clearable
        v-model="searchParams.content"
        placeholder="请输入要查找标题"
      />
      <el-button type="primary" size="large" @click="handleSearch">
        <el-icon size="24"><Search /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
#container {
  height: auto;
  width: 100%;
}
#wrapper {
  padding: 0px var(--search-input-padding);
  position: relative;
}
.el-input {
  font-size: large;
}
.el-input:deep() .el-input__wrapper {
  height: auto;
  border: 1px #b4cfe4 solid;
  padding: 4px 15px;
  padding-right: 79px;
}
.el-button {
  border: none;
  position: absolute;
  right: var(--search-btn-position);
}
</style>
