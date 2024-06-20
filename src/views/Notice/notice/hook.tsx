import { reactive, ref, h } from "vue";
import type {  LoadingConfig } from "@pureadmin/table";
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
  const formRef = ref();
  const noticeColumns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      reserveSelection: true
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
      label: "作者姓名",
      prop: "author_name",
      width: 100
    },
    {
      label: "学院",
      prop: "department_name",
      width: 180
    },
    {
      label: "发布时间",
      prop: "publish_time",
      minWidth: 160
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

  function openDialog(title, announcementId) {
    noticeApi
      .getNoticeContent(announcementId)
      .then((data) => {
        addDialog({
          title: title,
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
    noticeColumns,
    loadingConfig,
    openDialog
  };
}


