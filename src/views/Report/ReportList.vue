<!-- ReportList.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { UploadUserFile } from "element-plus";
import announcementApi from "@/api/announcement";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
interface ReportFile {
  name: string;
  url: string;
}
interface ReportItem {
  id: string;  // 改为 string 类型
  report_type: string;
  create_time: string;
  report_file: ReportFile[];
  uploader_id: string;
}
const props = defineProps<{
  clubId: number;
  refreshFlag: number;
}>();
const reports = ref<ReportItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const parseFileName = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const decodedPath = decodeURIComponent(parsedUrl.pathname);
    return decodedPath.split('/').pop() || "未命名文件";
  } catch {
    const cleanUrl = url.split(/[?#]/)[0];
    return decodeURIComponent(cleanUrl).split('/').pop() || "未命名文件";
  }
};
const loadData = async () => {
  try {
    loading.value = true;
    const res = await announcementApi.getReports(
      props.clubId,
      currentPage.value,
      pageSize.value
    );
    console.log("API 完整响应:", res);
    
    // 直接访问 res.data（响应结构为 { status_code, status_text, data }）
    const responseData = res || {};
    console.log("分页数据:", {
      records: responseData.records,
      total: responseData.total_item
    });
    reports.value = (responseData.records || []).map(item => ({
      ...item,
      id: String(item.id),  // 确保转换为字符串
      report_file: (item.report_file || []).map(url => ({
        name: parseFileName(url),
        url: url
      }))
    }));
    total.value = responseData.total_item || 0;
  } catch (error) {
    console.error("数据加载失败:", error);
    ElMessage.error("数据加载失败");
  } finally {
    loading.value = false;
  }
};
const confirmDelete = async (reportId: string) => {  // 改为 string 类型
  try {
    await ElMessageBox.confirm("确定要删除该成果汇报吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    
    await announcementApi.deleteReport(reportId);
    ElMessage.success("删除成功");
    
    if (reports.value.length === 1 && currentPage.value > 1) {
      currentPage.value--;
    }
    await loadData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

onMounted(() => {
  loadData();
});



watch(
  () => props.clubId,
  () => {
    currentPage.value = 1
    loadData()
  }
)

watch(
  () => props.refreshFlag,
  () => {
    currentPage.value = 1
    loadData()
  }
)

const handlePageChange = () => {
  loadData();
};
</script>

<template>
  <div class="report-list-container">
    <el-table 
      :data="reports" 
      v-loading="loading"
      stripe
      border
    >
      <el-table-column 
        prop="report_type" 
        label="类型" 
        width="120"
        align="center"
      />
      
      <el-table-column 
        label="文件" 
        min-width="300"
      >
        <template #default="{ row }">
          <div class="file-list">
            <el-tag
              v-for="(file, index) in row.report_file"
              :key="index"
              type="info"
              class="file-tag"
            >
              <el-link 
                type="primary" 
                :href="file.url" 
                target="_blank"
                :download="file.name"
              >
                {{ file.name }}
              </el-link>
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column 
        label="提交时间" 
        width="180"
        align="center"
      >
        <template #default="{ row }">
          {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>

      <el-table-column 
        prop="uploader_id" 
        label="上传者" 
        width="120"
        align="center"
      />

      <el-table-column 
        label="操作" 
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-button 
            type="danger" 
            size="small" 
            @click="confirmDelete(row.id)"
            plain
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="handlePageChange"
        @size-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.report-list-container {
  padding: 20px;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-tag {
  max-width: 250px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
