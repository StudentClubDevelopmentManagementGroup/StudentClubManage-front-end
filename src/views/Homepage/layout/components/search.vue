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
  <div class="h-auto w-full">
    <div class="search-container relative">
      <el-input
        class=""
        @change="handleInput"
        clearable
        v-model="searchParams.content"
        placeholder="请输入要查找标题"
      />
      <el-button class="absolute" type="primary" size="large" @click="handleSearch">
        <el-icon size="24"><Search /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  padding: 0 var(--search-input-padding);

  .el-input:deep() .el-input__wrapper {
    border: 1px #b4cfe4 solid;
    padding: 4px 16px;
    padding-right: 80px;
  }

  .el-button {
    right: var(--search-input-padding);
  }
}
</style>
