<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import useStore from "@/store";
import { message } from "@/utils/message";

const regex = /[^\w\s《》<>一-龥]/g; // 允许 汉字、数字、字母、《》、<>
const regexTrim = /^\s+|\s+$/g; // 匹配开头或结尾的空格

const router = useRouter();
const route = useRoute();

const searchParams = reactive({
  content: route.query?.search ? route.query.search : "",
});

watch(route, () => {
  searchParams.content = route.query?.search ? route.query.search : "";
  useStore.homepageStore.setTitleKeyword(searchParams.content);
});

const handleInput = (value) => {
  if (regexTrim.test(value)) {
    message("开头或结尾不能有空格", { type: "warning", showClose: true });
    searchParams.content = value.replaceAll(regexTrim, "");
  } else if (regex.test(value)) {
    message("只允许输入汉字、数字、字母", { type: "warning", showClose: true });
    searchParams.content = value.replaceAll(regex, "");
  }
};

const handleSearch = () => {
  const value = searchParams.content;
  if (!regexTrim.test(value) && !regex.test(value)) {
    router.replace(`/homepage/list?search=${searchParams.content}`);
    useStore.homepageStore.setTitleKeyword(searchParams.content);
  }
};

onMounted(() => {
  useStore.homepageStore.setTitleKeyword(searchParams.content);
});
</script>

<template>
  <div class="h-auto w-full">
    <div class="search-container relative">
      <el-input
        @change="handleInput"
        @keyup.enter="handleSearch"
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
