import type { PaginationProps, TableColumns, LoadingConfig, AdaptiveConfig } from "@pureadmin/table";
import { delay } from "@pureadmin/utils";
import { ref, reactive, computed, onMounted } from "vue";
import useStore from "@/store";
import registrationApi from "@/api/registration";
import testData from "./test-data/mock";
import formatUtil from "@/utils/formatter"
interface TableColumnList extends Array<TableColumns> { }

export default function useColumns() {
    const tableData = ref([])
    const userInfo = computed(() => useStore.userStore.getUserInfo)
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const checkStatus = ref("exception") // 用于检测是否处在签到状态 success:签到中、exception：待签到
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
        time: [],
        timeLong: {
            hour: 0,
            minute: 0
        }
    })
    // 日期选择器 shortcuts 配置
    const shortcuts = [
        {
            text: "一周前",
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
            }
        },
        {
            text: "一个月前",
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
            }
        },
        {
            text: "三个月前",
            value: () => {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
            }
        }
    ];
    /** 表格列配置 */
    const columns: TableColumnList = [
        {
            label: "勾选列", // 如果需要表格多选，此处label必须设置
            type: "selection",
            fixed: "left",
            reserveSelection: true // 数据刷新后保留选项
        },
        {
            label: "日期",
            prop: "date",
            minWidth: 150,
            cellRenderer: ({ row }) => {
                return row.checkInTime.slice(0, 10)
            }
        },
        {
            label: "签到时间",
            prop: "checkInTime",
            minWidth: 150,
            cellRenderer: ({ row }) => {
                return row.checkInTime.slice(11, 19)
            }
        },
        {
            label: "签退时间",
            prop: "checkoutTime",
            minWidth: 150,
            cellRenderer: ({ row }) => {
                if (row.checkoutTime) {
                    return row.checkoutTime.slice(11, 19)
                } else {
                    return ""
                }
            }
        },
        {
            label: "时长",
            minWidth: 200,
            cellRenderer: ({ row, props }) => {
                if (row.checkoutTime) {
                    // 成功签退
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
                } else if (!row.deleted) {
                    // 今日已签到，但尚未签退
                    return <el-tag type="primary">未签退</el-tag>
                } else {
                    // 未当日签退的记录
                    return <el-tag type="danger" >当天未签退</el-tag>
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
    // 统一的访问 API 的参数来源
    // TODO: 随进入的club页面赋值clubId，userId作为测试用
    const getDataParams = computed(() => ({
        clubId: 1,
        // userId: userInfo.value.user_id,
        userId: "2100301816",
        startTime: searchStatus.value ? formatUtil.formatDate(searchInput.time[0]) + "00:00:00" : "",
        endTime: searchStatus.value ? formatUtil.formatDate(searchInput.time[1]) + formatUtil.getNowTime() : "",
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize
    }))
    // 获取数据
    const fetchTableData = async () => {
        return new Promise((resolve, reject) => {
            registrationApi.getRegistrationList(getDataParams.value)
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
    // 刷新数据
    const refreshTabaleData = () => {
        loading.value = true;
        delay(600).then(() => {
            fetchTableData()
        })
    }
    // 添加数据
    const addTableData = () => {
        console.log("添加数据行")
    }
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
    // 导出Excel
    const exportExcel = () => {
        console.log("导出Excel")
    }
    // 检索
    const handleSearch = () => {
        if (searchInput.time.length !== 0) {
            searchStatus.value = true;
        }
        loading.value = true
        delay(600).then(() => {
            fetchTableData()
        })
        console.log("检索", getDataParams.value)
    }
    // 重置检索
    const handleReset = () => {
        // 成功检索
        if (searchStatus.value) {
            searchInput.time = [];
            searchInput.timeLong.hour = 0;
            searchInput.timeLong.minute = 0;
            loading.value = true
            delay(600).then(() => {
                fetchTableData()
            })
        }
    }
    // 获取当前签到状态
    const getCheckStatus = () => {
        return new Promise((resolve, reject) => {
            registrationApi.getLatestCheckInRecord({
                clubId: getDataParams.value.clubId,
                userId: getDataParams.value.userId,
            })
                .then((data) => {
                    // TODO: 逻辑待调整，后端有些问题，进一步完善时再提
                    if (!data.data) {
                        checkStatus.value = 'success'
                    } else {
                        checkStatus.value = 'exception'
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }
    // 签到
    const checkIn = () => {
        return new Promise((resolve, reject) => {
            registrationApi.checkIn({
                clubId: getDataParams.value.clubId,
                userId: getDataParams.value.userId,
                checkInTime: formatUtil.getNowDatetime()
            })
                .then((data) => {
                    checkStatus.value = 'success'
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }
    // 签退
    const checkOut = () => {
        return new Promise((resolve, reject) => {
            registrationApi.checkOut({
                clubId: getDataParams.value.clubId,
                userId: getDataParams.value.userId,
                checkoutTime: formatUtil.getNowDatetime()
            })
                .then((data) => {
                    checkStatus.value = 'exception'
                })
                .catch((error) => {
                    console.error(error)
                })
        })
    }
    // 补签
    const reCheckIn = () => {
        // TODO: 补签
        console.log("补签")
    }
    // 处理签到/签退
    const handleCheck = () => {
        if (checkStatus.value === 'success') {
            delay(600).then(() => {
                checkOut();
            })
        } else if (checkStatus.value === 'exception') {
            delay(600).then(() => {
                checkIn();
            })
        }
    }

    onMounted(() => {
        getCheckStatus()
        delay(600).then(() => {
            fetchTableData()
        })
    })

    return {
        tableData,
        userInfo,
        searchStatus,
        checkStatus,
        loading,
        pagination,
        searchInput,
        shortcuts,
        columns,
        adaptiveConfig,
        loadingConfig,
        getDataParams,

        fetchTableData,
        refreshTabaleData,
        addTableData,
        exportExcel,
        onSizeChange,
        onCurrentChange,
        getCheckStatus,
        checkIn,
        checkOut,
        reCheckIn,
        handleCheck,
        handleSearch,
        handleReset,
    }
}