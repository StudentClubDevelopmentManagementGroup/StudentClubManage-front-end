import { reactive, ref, onMounted, h } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import draftContent from "./draft-content.vue";
import { addDialog } from "@/components/Dialog";
import noticeApi from "@/api/announcement";

interface FormItemProps {
  /** 学号 */
  draft_id: string;
  create_time: string;
  update_time: string;
  content: string;
  title: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };

export function useRole() {
  const formRef = ref();
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

  function openDialog(title, draftId) {
    noticeApi
      .getDraftContent(draftId)
      .then((data) => {
        addDialog({
          title: "查看草稿公告详情",
          props: {
            formInline: {
              draft_id: data.draft_id ?? "",
              create_time: data.create_time ?? "",
              update_time: data.update_time ?? "",
              content: data.content ?? "",
              title: data.title ?? "",
            }
          },
          width: "45%",
          draggable: true,
          fullscreen: deviceDetection(),
          fullscreenIcon: true,
          closeOnClickModal: false,
          contentRenderer: () => h(draftContent, { ref: formRef }),
        });
      })
      .catch((error) => { });
  }

  return {
    draftColumns,
    loadingConfig,
    openDialog
  };
}


