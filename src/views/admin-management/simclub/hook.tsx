// hook.tsx
import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { clubFormItemProps } from "./types"
import { ref, reactive, computed, h, watch, toRaw } from "vue"; // 新增 toRaw 和 watch
import { message } from "@/utils/message";
import { delay } from "@pureadmin/utils";
import { addDialog } from "@/components/Dialog";
import baseApi from "@/api/base";
import memberApi from "@/api/member";
import useStore from "@/store";
import clubSetForm from "./clubSetForm.vue";
interface TableColumnList extends Array<TableColumns> { }
export function useClubColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const tableLoading = ref(true)
    const pagination = reactive<PaginationProps>({
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 15, 20],
        total: 0,
        align: "center",
        background: true,
        small: false
    });
    // 修改点1：添加 toRaw 处理
    const club_id = computed(() => {
        const club = toRaw(useStore.clubStore.getCurrentClub());
        return club?.club_id ? Number(club.club_id) : null;
    });
    // 修改点2：改用 reactive 参数对象
    const params = reactive({
        club_id: null,
        page_num: pagination.currentPage,
        page_size: pagination.pageSize
    })
    // 修改点3：添加 watch 监听参数变化
    watch(
        [club_id, () => pagination.currentPage, () => pagination.pageSize],
        ([newClubId, newPageNum, newPageSize]) => {
            params.club_id = newClubId;
            params.page_num = newPageNum;
            params.page_size = newPageSize;
        },
        { immediate: true }
    );
    const columns: TableColumnList = [
        {
            label: "社团/基地名称",
            prop: "club_name",
            minWidth: 100,
        },
        {
            label: "学院",
            prop: "department_name",
            minWidth: 100,
            showOverflowTooltip: true
        },
        {
            label: "成员数",
            prop: "number",
            width: 100,
        },
        {
            label: "社团负责人",
            prop: "manager",
            width: 250,
            cellRenderer: ({ row }) => <div> {row.manager === null ? "未设置" : row.manager}</div>,
        },
        {
            label: "招新状态",
            prop: "state",
            width: 85,
            // 修改点4：使用 toRaw 处理行数据
            cellRenderer: ({ row }) => {
                const state = toRaw(row).state;
                return state 
                    ? <el-tag type="info">停止招新</el-tag>
                    : <el-tag type="success">招新中</el-tag>
            }
        },
        {
            label: "启用状态",
            prop: "is_deleted",
            width: 85,
            cellRenderer: ({ row }) => toRaw(row).is_deleted 
                ? <el-tag type="danger">未启用</el-tag>
                : <el-tag type="success">启用中</el-tag>
        },
        {
            label: "操作",
            fixed: "right",
            width: 240,
            slot: "operation"
        },
    ];

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

   const onLoading = async () => {
           tableLoading.value = true;
           delay(20000).then(() => tableLoading.value = false);
       }
       const onSizeChange = (val) => {
           pagination.pageSize = val
           onLoading()
           fetchTableData()
       }
       const onCurrentChange = (val) => {
           pagination.currentPage = val;
           loadingConfig.text = `正在加载第${val}页...`;
           onLoading()
           fetchTableData()
       }
       // 修改点5：重构 fetchTableData 方法
       const fetchTableData = () => {
           // 使用安全参数处理
           const safeParams = {
               ...toRaw(params),
               club_id: params.club_id // 确保基本类型
           }
           baseApi.getBaseOwn(safeParams)
               .then(data => {
                   tableData.value = data.records;
                   pagination.total = parseInt(data.total_item);
                   tableLoading.value = false;
               })
               .catch(() => {
                   tableData.value = [];
                   pagination.total = 0;
                   tableLoading.value = false;
               })
       }
       // 修改点6：表单提交使用 toRaw
       const setManager = (val) => {
           memberApi.setManager(toRaw(val))
               .then(() => {
                   message("设置负责人成功", { type: 'success' })
                   fetchTableData()
               })
               .catch(error => console.warn(error))
       }
       const toggleRecruitment = (val) => {
           baseApi.changestate(toRaw(val))
               .then(() => {
                   message("更改招新状态成功", { type: "success" })
                   fetchTableData()
               })
               .catch(error => console.warn(error))
       }
       // 修改点7：对话框数据处理
       const openDialog = (title, row) => {
           addDialog({
               title: title,
               props: {
                   formInline: {
                       user_id: toRaw(row)?.user_id ?? "", // 使用 toRaw
                   }
               },
               width: "40%",
               contentRenderer: () => h(clubSetForm),
               beforeSure: (done, { options }) => {
                   const curData = toRaw(options.props.formInline); // 获取原始数据
                   setManager({
                       user_id: Number(curData.user_id), // 明确类型转换
                       club_id: toRaw(row).club_id,
                   })
                   done();
               }
           });
       }
       return {
           tableRef,
           tableData,
           tableLoading,
           pagination,
           columns,
           loadingConfig,
           fetchTableData,
           onLoading,
           onSizeChange,
           onCurrentChange,
           toggleRecruitment,
           openDialog
       }
   }