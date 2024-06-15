import { message } from "@/utils/message";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import addForm from "../group/form.vue";
import addGroupForm from "./group-form.vue";
import { addDialog } from "@/components/Dialog";
import dutyApi from "@/api/duty";
import { GetUserInfo } from '@/utils/auth'

interface FormItemProps {
  group_name: string;
  member_id: string;
  club_id: number;
}

interface GroupFormItemProps {
  number: string;
  area: string;
  date_time: string;
  arranger_id: string;
  cleaner_id: string;
  club_id: number;
  is_mixed: boolean;
  group_name: string;
}

interface FormProps {
  formInline: FormItemProps;
}

interface GroupFormProps {
  formInline: GroupFormItemProps;
}

export type { FormItemProps, FormProps, GroupFormProps, GroupFormItemProps };

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
      label: "社团id",
      prop: "clubId",
    },
    {
      label: "小组名称",
      prop: "name",
    },
    {
      label: "成员学号",
      prop: "memberId",
      minWidth: 180
    },
    {
      label: "操作",
      fixed: "right",
      width: 360,
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

  function openDialog(title = "新增", group_name) {
    addDialog({
      title: `${title}值日信息`,
      props: {
        formInline: {
          number: "",
          area: "",
          date_time: "",
          arranger_id: GetUserInfo().user_id ?? "",
          group_name: group_name ?? "",
          club_id: 1,
          is_mixed: true,
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addGroupForm, { ref: formRef }),
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


