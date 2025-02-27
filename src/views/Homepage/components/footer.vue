<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import useStore from "@/store";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="wrapper container__mwidth">
    <div class="container-width h-[144px] flex items-center justify-center m-auto">
      <div style="flex: 1" class="h-full flex items-center justify-center">
        <img style="width: 90%" src="@/assets/logo10.png" alt="" />
      </div>
      <div style="flex: 2" class="text-white flex flex-col">
        <div>
           
        </div>
        <div>占位符</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background-image: url("@/assets/footer-pattern.png");
  background-color: rgb(0, 113, 174);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
