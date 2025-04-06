<!-- index.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import useStore from "@/store";
import reportApi from "@/api/report";
import ReportList from "./ReportList.vue";

interface ReportForm {
  club_id: number;
  report_type: string;
  file: File[];
}

const club_id = computed(() => {
  const club = useStore.clubStore.getCurrentClub();
  return Number(club.club_id);
});

const activeTab = ref("submit");
const refreshKey = ref(0);

const reportForm = ref<ReportForm>({
  club_id: club_id.value,
  report_type: "",
  file: []
});

const reportTypeOptions = [
  { label: "竞赛", value: "竞赛" },
  { label: "论文", value: "论文" },
  { label: "学习情况", value: "学习情况" },
  { label: "参加的比赛", value: "参加的比赛" },
  { label: "采访", value: "采访" },
  { label: "其他", value: "其他" }
];

const resetForm = () => {
  reportForm.value = {
    club_id: club_id.value,
    report_type: "",
    file: []
  };
};

const handleFileUpload = (uploadFile: { raw: File }) => {
  if (uploadFile?.raw) {
    if (reportForm.value.file.length >= 5) {
      ElMessage.warning("最多上传5个文件");
      return;
    }
    reportForm.value.file.push(uploadFile.raw);
  }
};

const removeFile = (index: number) => {
  reportForm.value.file.splice(index, 1);
};

const submitForm = async () => {
  if (!reportForm.value.report_type) {
    ElMessage.warning("请选择成果类型");
    return;
  }

  if (reportForm.value.file.length === 0) {
    ElMessage.warning("请至少上传一个文件");
    return;
  }

  const formData = new FormData();
  formData.append("club_id", reportForm.value.club_id.toString());
  formData.append("report_type", reportForm.value.report_type);
  reportForm.value.file.forEach(file => {
    formData.append("file", file);
  });

  try {
    await reportApi.addReport(formData);
    ElMessage.success("提交成功");
    resetForm();
    refreshKey.value++;
    activeTab.value = "list";
  } catch (error) {
    ElMessage.error("提交失败");
  }
};
</script>

<template>
  <div class="report-container">
    <el-card shadow="never" class="!border-none">
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane label="提交成果" name="submit">
          <el-form label-width="100px" label-position="top">
            <el-form-item label="成果类型" required>
              <el-select
                v-model="reportForm.report_type"
                placeholder="请选择成果类型"
                class="w-full"
              >
                <el-option
                  v-for="item in reportTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="成果文件" required>
              <el-upload
                multiple
                :limit="5"
                :show-file-list="false"
                :on-change="handleFileUpload"
                :auto-upload="false"
                :file-list="reportForm.file"
              >
                <el-button type="primary">
                  <i class="el-icon-upload" /> 选择文件
                </el-button>
                <template #tip>
                  <div class="text-gray-500">
                    支持格式：PDF/Word/图片，单个文件不超过10MB，最多5个文件
                  </div>
                </template>
              </el-upload>

              <div class="mt-4">
                <div
                  v-for="(file, index) in reportForm.file"
                  :key="index"
                  class="file-item"
                >
                  <div class="file-info">
                    <i class="el-icon-document" />
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">
                      ({{ (file.size / 1024 / 1024).toFixed(2) }}MB)
                    </span>
                  </div>
                  <el-button
                    type="danger"
                    text
                    @click="removeFile(index)"
                  >
                    移除
                  </el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <div class="flex justify-end gap-4">
                <el-button @click="resetForm">重置</el-button>
                <el-button type="primary" @click="submitForm">
                  提交成果
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="成果列表" name="list">
          <ReportList
            :club-id="Number(club_id)" 
            :refresh-flag="refreshKey" 
            class="mt-4"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-info {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.file-name {
  margin: 0 8px;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #909399;
}

.demo-tabs {
  min-height: 400px;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__content) {
  padding: 20px;
}
</style>
