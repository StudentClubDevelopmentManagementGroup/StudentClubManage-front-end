import { message } from "@/utils/message";
import { reactive, ref, computed, h } from "vue";
import type { PaginationProps, LoadingConfig } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> { }
import { deviceDetection } from "@pureadmin/utils";
import addForm from "./add-form.vue";
import addGroupForm from "./group-form.vue";
import { addDialog } from "@/components/Dialog";
import dutyApi from "@/api/duty";
import { GetUserInfo } from '@/utils/auth'
import useStore from "@/store";

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
  isNowGroup: boolean
}

interface GroupFormProps {
  formInline: GroupFormItemProps;
}

export type { FormItemProps, FormProps, GroupFormProps, GroupFormItemProps };

export function useRole() {
  const formRef = ref();
  const club_id = computed(() => useStore.clubStore.getCurrentClub().club_id);
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "社团id",
      prop: "club_id",
    },
    {
      label: "小组名称",
      prop: "group_name",
    },
    {
      label: "成员学号",
      prop: "member_id",
      minWidth: 180
    },
    {
      label: "成员姓名",
      prop: "user_name",
      minWidth: 180
    },
    {
      label: "操作",
      fixed: "right",
      width: 480,
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

  function openDialog(title = "新增", group_name) {
    addDialog({
      title: `${title}小组值日信息`,
      props: {
        formInline: {
          number: "",
          area: "",
          date_time: "",
          arranger_id: GetUserInfo().user_id ?? "",
          group_name: group_name ?? "",
          club_id: club_id.value,
          is_mixed: false,
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
            dutyApi.addGroupDuty(curData)
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

  function openAddDialog(group_name = "", isNowGroup = false) {
    addDialog({
      title: isNowGroup ? '新增成员' : '新建分组',
      props: {
        formInline: {
          group_name: group_name ?? "",
          member_id: "",
          club_id:  club_id.value,
        },
        isNowGroup: isNowGroup
      },
      width: "30%",
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
            dutyApi.addMember(curData)
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
    columns,
    loadingConfig,
    openDialog,
    openAddDialog
  };
}
