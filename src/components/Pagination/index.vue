<script setup>
import { computed } from 'vue'
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['pagination', 'update:page', 'update:limit'])

const currentPage = computed({
  get: () => props.page,
  set(val) {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    console.log(2)
    emit('update:limit', val)
  }
})

const handleSizeChange = (val) => {
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
  emit('pagination', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val) => {
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
  emit('pagination', { page: val, limit: pageSize.value })
}

const kkx = () => {
  emit('update:page', 2)
}
</script>

<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="props.background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="props.layout"
      :page-sizes="props.pageSizes"
      :total="props.total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
