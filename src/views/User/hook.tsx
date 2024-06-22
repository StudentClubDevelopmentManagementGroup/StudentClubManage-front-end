import { reactive, ref, onMounted, toRaw,h } from "vue";
import type { PaginationProps ,LoadingConfig} from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }


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

  return {
    form,
    columns,
    pagination,
    loadingConfig,
  };
}


