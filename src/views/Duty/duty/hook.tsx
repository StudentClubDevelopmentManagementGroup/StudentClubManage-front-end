import { message } from "@/utils/message";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import addForm from "./form.vue";
import { addDialog } from "@/components/Dialog";
import dutyApi from "@/api/duty";
import { GetUserInfo } from '@/utils/auth'
import { Plus } from '@element-plus/icons-vue'

interface FormItemProps {
  number: string;
  area: string;
  date_time: string;
  arranger_id: string;
  cleaner_id: string;
  club_id: number;
  is_mixed: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };

export function useRole() {
  const form = reactive({
    name: "",
    department_id: "",
  });
  const dataList = ref([]);
  const loading = ref(true);
  const formRef = ref();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    align: "center",
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "房间号",
      prop: "number",
      width: 120
    },
    {
      label: "面积",
      prop: "area",
      width: 100
    },
    {
      label: "值日时间",
      prop: "date_time",
      minWidth: 180
    },
    {
      label: "安排人",
      prop: "arranger_name",
      width: 100
    },
    {
      label: "值日人",
      prop: "cleaner_name",
      minWidth: 120
    },
    {
      label: "值日人学号",
      prop: "cleaner_id",
      minWidth: 100
    },
    {
      label: "值日图片",
      slot: "image_file",
      width: 240,
    },
    {
      label: "操作",
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
  });

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleOffline(row) {
    message(`${row.username}已被强制下线`, { type: "success" });
    onSearch();
  }

  /** 取消选择 */
  async function onSearch() {
    loading.value = true;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}值日信息`,
      props: {
        formInline: {
          number: row?.number ?? "",
          area: row?.area ?? "",
          date_time: row?.date_time ?? "",
          arranger_id: GetUserInfo().user_id ?? "",
          cleaner_id: row?.cleaner_id ?? "",
          club_id: 1,
          is_mixed: row?.is_mixed ?? 1,
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(valid => {
          if (valid) {
            dutyApi.addMemberDuty(curData)
              .then(data => {
                message("添加成功", { type: "success" });
                done();
              })
              .catch(err => { })
          }
        });
      }
    });
  }

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    loadingConfig,
    handleOffline,
    handleSizeChange,
    handleCurrentChange,
    openDialog
  };
}


