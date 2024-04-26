import type { PaginationProps, TableColumns, LoadingConfig, AdaptiveConfig } from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { ref, reactive, computed, onMounted } from "vue";
import useStore from "@/store";
import registrationApi from "@/api/registration";
import testData from "./test-data/mock";
interface TableColumnList extends Array<TableColumns> { }

export default function useColumns() {
    const tableData = ref([])

    const userInfo = computed(() => useStore.userStore.getUserInfo)
    const loading = ref(true)
    // 分页器配置
    const pagination = reactive<PaginationProps>({
        pageSize: 15,
        currentPage: 1,
        pageSizes: [10, 15, 20],
        total: 0,
        align: "center",
        background: true,
        small: false
    });
    // 搜索框输入内容
    const searchInput = reactive({

    })
    // 访问 API 的参数
    // TODO: 随进入的club页面赋值clubId，userId作为测试用
    const getTableDataParams = computed(() => ({
        clubId: 1,
        // userId: userInfo.value.user_id,
        userId: "2100301816",
        startTime: "",
        endTime: "",
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize
    }))
    // 列配置
    const columns: TableColumnList = [
        {
            label: "勾选列", // 如果需要表格多选，此处label必须设置
            type: "selection",
            fixed: "left",
            reserveSelection: true // 数据刷新后保留选项
        },
        {
            label: "签到时间",
            prop: "checkInTime",
            minWidth: 200
        },
        {
            label: "签退时间",
            prop: "checkoutTime",
            minWidth: 200
        },
        {
            label: "签到时长",
            prop: "deleted",
            minWidth: 200,
            cellRenderer: ({ row, props }) => {
                if (!row.checkoutTime) {
                    return <el-tag type="danger" >无效记录</el-tag>
                } else {
                    // 计算签到时长
                    let date1 = new Date(row.checkInTime)
                    let date2 = new Date(row.checkoutTime)

                    let diffInTime = Math.abs(date1.getTime() - date2.getTime());
                    let diffInMinutes = Math.floor(diffInTime / (1000 * 60));
                    let diffInHours = Math.floor(diffInMinutes / 60);

                    diffInHours %= 24;
                    diffInMinutes %= 60;

                    let hoursStr = diffInHours != 0 ? `${diffInHours}小时` : ""
                    let minutesStr = diffInMinutes != 0 ? `${diffInMinutes}分钟` : ""
                    let time = hoursStr + minutesStr

                    return <div style="line-height:32px;">{time}</div>;
                }
            }
        },
        {
            label: "",
            fixed: "right",
            minWidth: 200,
            slot: "operation",
        },
    ];
    /** 撑满内容区自适应高度相关配置 */
    const adaptiveConfig: AdaptiveConfig = {
        /** 表格距离页面底部的偏移量，默认值为 `96` */
        offsetBottom: 125
    };
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
    // 跳转页
    function onSizeChange(val) {
        pagination.pageSize = val
        loading.value = true
        delay(600).then(() => {
            fetchTableData()
        })
    }
    // 换页
    function onCurrentChange(val) {
        loadingConfig.text = `正在加载第${val}页...`;
        pagination.currentPage = val;
        loading.value = true
        delay(600).then(() => {
            fetchTableData()
        });
    }
    // 刷新数据
    function refreshTabaleData() {
        loading.value = true;
        delay(600).then(() => {
            fetchTableData()
        })
    }
    // 获取数据
    const fetchTableData = async () => {
        return new Promise((resolve, reject) => {
            registrationApi.getRegistrationList(getTableDataParams.value)
                .then((data) => {
                    tableData.value = data.records;
                    pagination.total = parseInt(data.total_item);
                    loading.value = false;
                })
                .catch((error) => {
                    console.error(error)
                    loading.value = false;
                })
        })
    }
    // 新增数据
    const addTableData = () => {
        console.log("新增数据")
    }

    const exportExcel = () => {
        console.log("导出Excel")
    }

    onMounted(() => {
        delay(600).then(() => {
            fetchTableData()
        })
    })

    return {
        tableData,
        userInfo,
        getTableDataParams,
        columns,
        pagination,
        loading,
        loadingConfig,
        adaptiveConfig,

        fetchTableData,
        addTableData,
        exportExcel,
        refreshTabaleData,
        onSizeChange,
        onCurrentChange
    }
}