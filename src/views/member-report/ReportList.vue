<!-- ReportList.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { UploadUserFile } from "element-plus";
import { Download, Search } from '@element-plus/icons-vue';
import reportApi from "@/api/report";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";

interface ReportFile {
  name: string;
  url: string;
}

interface ReportItem {
  id: string;
  report_type: string;
  create_time: string;
  report_file: ReportFile[];
  uploader_id: string;
}

const props = defineProps<{
  clubId: number;
  refreshFlag: number;
}>();

// 新增：选中报告列表
const selectedReports = ref<ReportItem[]>([]);
const handleSelectionChange = (selected: ReportItem[]) => {
  selectedReports.value = selected;
};

// 新增：批量下载方法
const batchDownload = async () => {
  const filesToDownload: ReportFile[] = [];
  selectedReports.value.forEach(report => {
    filesToDownload.push(...report.report_file);
  });

  if (filesToDownload.length === 0) {
    ElMessage.warning('请先选择要下载的文件');
    return;
  }

  // 逐个下载文件
  for (const file of filesToDownload) {
    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  ElMessage.success('已开始批量下载');
};

const reports = ref<ReportItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchKeyword = ref("");

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
    let res;
    
    if (searchKeyword.value) {
      res = await reportApi.getReportsBykeyword(
        props.clubId,
        currentPage.value,
        pageSize.value,
        searchKeyword.value
      );
    } else {
      res = await reportApi.getMemberReports(
        props.clubId,
        currentPage.value,
        pageSize.value
      );
    }
    
    const responseData = res || {};
    reports.value = (responseData.records || []).map(item => ({
      ...item,
      id: String(item.id),
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

const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const clearSearch = () => {
  searchKeyword.value = "";
  currentPage.value = 1;
  loadData();
};

const confirmDelete = async (reportId: string) => {
  try {
    await ElMessageBox.confirm("确定要删除该成果汇报吗？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    
    await reportApi.deleteReport(reportId, props.clubId);
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

const handleDownload = (file: ReportFile) => {
  const link = document.createElement('a');
  link.href = file.url;
  link.setAttribute('download', file.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  ElMessage.success('文件开始下载');
};

const handlePageChange = () => {
  loadData();
};

onMounted(() => {
  loadData();
});

watch(
  () => props.clubId,
  () => {
    currentPage.value = 1;
    loadData();
  }
);

watch(
  () => props.refreshFlag,
  () => {
    currentPage.value = 1;
    loadData();
  }
);
</script>

<template>
  <div class="report-list-container">
    <div class="action-bar">
      <div class="search-group">
        <el-input
          v-model="searchKeyword"
          placeholder="输入文件名关键词搜索"
          clearable
          style="width: 300px; margin-right: 10px"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
        <el-button @click="clearSearch">清空搜索</el-button>
      </div>
      
      <div class="action-buttons">
        <el-button 
          type="primary" 
          @click="batchDownload"
          :disabled="selectedReports.length === 0"
          class="download-btn"
        >
          <i class="el-icon-download" /> 下载
        </el-button>
      </div>
    </div>

    <el-table 
      :data="reports" 
      v-loading="loading"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 新增选择列 -->
      <el-table-column type="selection" width="55" align="center" />
      
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
              >
                {{ file.name }}
              </el-link>
              <el-button 
                type="primary" 
                link 
                :icon="Download" 
                @click="handleDownload(file)"
                class="download-btn"
                title="下载文件"
              />
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

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-tag {
  max-width: 450px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.download-btn {
  margin-left: 8px;
  padding: 1;
  height: auto;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    width: 100%;
    flex-direction: column;
  }
  
  .download-btn {
    width: 100%;
    margin-left: 0;
  }
}
</style>
