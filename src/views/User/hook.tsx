import { message } from "@/utils/message";
import { reactive, ref, onMounted, toRaw,h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import editForm from "./form.vue";
import { addDialog } from "@/components/Dialog";

interface FormItemProps {
  /** 学号 */
  userId: string;
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
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },

    {
      label: "学号",
      prop: "user_id",
      width: 120
    },
    {
      label: "姓名",
      prop: "name",
      width: 100
    },
    {
      label: "学院",
      prop: "department.department_name",
      minWidth: 180
    },
    {
      label: "手机号",
      prop: "tel",
      width: 120
    },
    {
      label: "邮箱",
      prop: "mail",
      minWidth: 160
    },
    {
      label: "角色",
      slot: "role",
      width: 240,
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

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
      title: `${title}角色`,
      props: {
        formInline: {
          userId: row?.userId ?? "",
        }
      },
      width: "32%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
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
    handleOffline,
    handleSizeChange,
    handleCurrentChange,
    openDialog
  };
}


