import { message } from "@/utils/message";
import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import noticeContent from "./notice-content.vue";
import { addDialog } from "@/components/Dialog";
import noticeApi from "@/api/announcement";

interface FormItemProps {
  /** 学号 */
  announcement_id: string;
  author_id: string;
  author_name: string;
  content: string;
  publish_time: string;
  title: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };

export function useRole() {
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
  const noticeColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      reserveSelection: true
    },
    // {
    //   label: "学院名称",
    //   prop: "department_name",
    //   width: 180
    // },
    // {
    //   label: "基地名称",
    //   prop: "club_name",
    //   width: 100
    // },
    {
      label: "作者学号",
      prop: "author_id",
      minWidth: 120
    },
    {
      label: "作者姓名",
      prop: "author_name",
      width: 100
    },
    {
      label: "发布时间",
      prop: "publish_time",
      minWidth: 160
    },
    {
      label: "标题",
      prop: "title",
      width: 240,
    },
    {
      label: "摘要",
      prop: "summary",
      width: 240,
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
      slot: "operation"
    }
  ];

  const draftColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "创建时间",
      prop: "create_time",
      minWidth: 160
    },
    {
      label: "发布时间",
      prop: "update_time",
      minWidth: 160
    },
    {
      label: "标题",
      prop: "title",
      width: 240,
    },
    {
      label: "摘要",
      prop: "summary",
      width: 240,
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
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

  function openDialog(title, announcementId) {
    noticeApi
      .getNoticeContent(announcementId)
      .then((data) => {
        addDialog({
          title: "查看公告详情",
          props: {
            formInline: {
              announcement_id: data.announcement_id ?? "",
              author_id: data.author_id ?? "",
              author_name: data.author_name ?? "",
              content: data.content ?? "",
              publish_time: data.publish_time ?? "",
              title: data.title ?? "",
            }
          },
          width: "45%",
          draggable: true,
          fullscreen: deviceDetection(),
          fullscreenIcon: true,
          closeOnClickModal: false,
          contentRenderer: () => h(noticeContent, { ref: formRef }),
        });
      })
      .catch((error) => { });
  }

  return {
    loading,
    noticeColumns,
    draftColumns,
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


