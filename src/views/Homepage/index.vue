<script setup>
import headview from "./components/header.vue";
import feet from "./components/footer.vue";
</script>

<template>
  <div id="container">
    <el-container>
      <el-header>
        <headview />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <feet />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.el-container {
  background-image: url("@/assets/background-pattern.jpg");
  background-color: rgb(236, 236, 236);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.el-header,
.el-main,
.el-footer {
  height: auto;
  padding: 0px;
}
.el-main {
  overflow: hidden;
}
</style>
