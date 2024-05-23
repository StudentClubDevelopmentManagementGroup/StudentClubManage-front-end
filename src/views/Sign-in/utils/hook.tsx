import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { FormItemProps } from "./types"
import { delay } from "@pureadmin/utils";
import { ref, reactive, computed, onMounted, h } from "vue";
import { message } from "@/utils/message";
import useStore from "@/store";
import registrationApi from "@/api/registration";
import formatUtil from "@/utils/formatter"

import editForm from "../form.vue";
import { addDialog } from "@/components/Dialog";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

interface TableColumnList extends Array<TableColumns> { }

export default function useColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const durationTime = ref('获取时长失败') // 时间段范围内的有效时长
    const selectValue = ref("签到记录");
    const svalue = computed(() => selectValue.value)
    const options = ref([
        {
            value: "签到记录",
            label: "签到记录"
        },
        {
            value: "打卡时长",
            label: "打卡时长"
        }
    ])

    // 搜索框输入内容
    const query = ref({
        name: "",
        userId: "",
        selectedTime: ["", ""]
    })

    /** 分页器配置 */
    const pagination = reactive<PaginationProps>({
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 15, 20],
        total: 0,
        align: "center",
        background: true,
        small: false
    });

    /** 日期选择器 shortcuts 配置 */
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
            align: "center", // 在宽度不够的情况下，表项勾选框变形,利用css深度选择器修复
            className: "cell-selection",
            reserveSelection: true
        },
        {
            label: "学号",
            prop: "userId",
            minWidth: 100,
        },
        {
            label: "姓名",
            prop: "userName",
            minWidth: 100,
        },
        {
            label: "签到时间",
            prop: "checkInTime",
            minWidth: 100,
            hide: (value) => svalue.value !== "签到记录",
        },
        {
            label: "签退时间",
            prop: "checkoutTime",
            minWidth: 100,
            hide: (value) => svalue.value !== "签到记录",
        },
        {
            label: "打卡时长",
            minWidth: 100,
            hide: (value) => svalue.value !== "打卡时长",
            cellRenderer: ({ row }) => <div>{formatUtil.formatTime(row.attendanceDurationTime)}</div>,
        },
        {
            label: "有效时长",
            minWidth: 100,
            hide: (value) => svalue.value !== "签到记录",
            cellRenderer: ({ row }) => {
                if (row.checkoutTime) {
                    // 成功签退
                    return <div>{formatUtil.formatTime(row.attendanceDuration)}</div>;
                } else if (!row.isDeleted) {
                    // 今日已签到，但尚未签退
                    return <el-tag type="primary">待签退</el-tag>
                } else {
                    // 未当日签退的记录
                    return <el-tag type="danger" >当天未签退</el-tag>
                }
            }
        },
        {
            label: "操作",
            fixed: "right",
            minWidth: 100,
            slot: "operation",
            hide: (value) => svalue.value !== "签到记录",
        },
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

    // 统一的访问 API 的参数来源
    const getDataParams = computed(() => ({
        clubId: useStore.useClubStore.getCurrentClub().club_id,
        userName: searchStatus.value ? query.value.name : "",
        userId: searchStatus.value ? query.value.userId : "",
        startTime: searchStatus.value ? query.value.selectedTime[0] : "",
        endTime: searchStatus.value ? query.value.selectedTime[1] : "",
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize
    }))

    // 表格进入加载流程
    const onLoading = async () => {
        tableLoading.value = true;
        delay(20000).then(() => {
            tableLoading.value = false;
        })
    }

    // 跳转页
    function onSizeChange(val) {
        onLoading()
        fetchTableData().then(() => {
            pagination.pageSize = val
        }).catch((error) => {
            message("加载失败", { type: "error" })
        })
    }

    // 换页
    function onCurrentChange(val) {
        loadingConfig.text = `正在加载第${val}页...`;
        onLoading()
        fetchTableData().then(() => {
            pagination.currentPage = val;
        }).catch((error) => {
            message("加载失败", { type: "error" })
        })
    }

    // 获取数据
    const fetchTableData = () => {
        if (selectValue.value === "签到记录") {
            // 获取签到记录
            return new Promise((resolve, reject) => {
                registrationApi.getRegistrationList(getDataParams.value)
                    .then((data) => {
                        tableData.value = data.records;
                        pagination.total = parseInt(data.total_item);
                        tableLoading.value = false; // 如果提前加载完成，则解除加载状态，否则等待请求超时
                        resolve(data)
                    })
                    .catch((error) => {
                        tableData.value = [];
                        pagination.total = 0;
                        tableLoading.value = false;
                        reject(error)
                    })
            })
        } else if (selectValue.value === "打卡时长") {
            // TODO: 催促后端分页  // 获取打卡时长 
            return new Promise((resolve, reject) => {
                registrationApi.getDurationTime(getDataParams.value)
                    .then((data) => {
                        // tableData.value = data.records;
                        // pagination.total = parseInt(data.total_item);
                        tableData.value = data
                        pagination.total = data.length
                        tableLoading.value = false; // 如果提前加载完成，则解除加载状态，否则等待请求超时
                        resolve(data)
                    })
                    .catch((error) => {
                        tableData.value = [];
                        pagination.total = 0;
                        tableLoading.value = false;
                        reject(error)
                    })
            })
        } else {
            message("系统出现了未知bug!", { type: "error" })
        }
    }

    // 刷新数据
    const refreshTabaleData = () => {
        onLoading()
        fetchTableData();
    }

    // 添加数据
    // TODO: 预留的其他新增
    const addTableData = () => {
        console.log("添加数据行")
    }

    // 获取当前时间段内的有效签到时长
    const getAvailableDurationTime = () => {
        return new Promise((resolve, reject) => {
            registrationApi.getDurationTime(getDataParams.value)
                .then((data) => {
                    durationTime.value = formatUtil.formatTime(data[0].attendanceDurationTime)
                })
                .catch((error) => {
                    console.warn(error)
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
                    message('签退成功', { type: 'success' })
                    fetchTableData()
                })
                .catch((error) => {
                    console.error(error)
                    tableLoading.value = false;
                })
        })
    }

    // 补签
    const reCheckIn = (val) => {
        return new Promise((resolve, reject) => {
            registrationApi.replenish({
                clubId: getDataParams.value.clubId,
                userId: val.userId,
                checkInTime: val.checkInTime,
                checkoutTime: val.checkOutTime
            }).then((data) => {
                onLoading()
                message("补签成功", { type: "success" })
                fetchTableData()
            }).catch((error) => {
                console.warn(error)
            })
        })
    }

    // 检索
    const handleSearch = () => {
        btnLoading.value = true;
        delay(1000).then(() => {
            btnLoading.value = false;
        })
        searchStatus.value = true;
        onLoading()
        fetchTableData()
    }

    // 重置检索
    const handleReset = () => {
        formRef.value.resetFields()
        if (searchStatus.value) {
            searchStatus.value = false;
            onLoading()
            fetchTableData()
        }
    }

    // 添加数据
    // TODO: 预留添加数据
    const handleAdd = () => {
        console.log("点击新增按钮")
        addTableData()
    }

    // 导出Excel
    // TODO:导出EXCEL
    const handleExport = () => {
        console.log("导出Excel")
    }

    onMounted(() => {
        onLoading()
        fetchTableData();
    });

    function openDialog(title, item, row?: FormItemProps) {
        useStore.useRegistrationStore.setCurrentCheckInTime(item.checkInTime)
        useStore.useRegistrationStore.setCurrentUserId(item.userId)
        addDialog({
            title: title,
            props: {
                formInline: {
                    customTime: row?.customTime ?? useStore.useRegistrationStore.getCurrentCheckInTime(),
                }
            },
            width: "40%",
            draggable: true,
            fullscreen: deviceDetection(),
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => h(editForm, { ref: formRef }),
            beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as FormItemProps;
                function chores() {
                    done(); // 关闭弹框
                }
                FormRef.validate((valid: any) => {
                    //TODO: 调用的接口与打卡记录处的补签接口是同一个接口无法超过7天无法补签的限制
                    if (valid) {
                        if (useStore.useRegistrationStore.getSwitchStatus() === "now") {
                            reCheckIn({
                                userId: useStore.useRegistrationStore.getCurrentUserId(),
                                checkInTime: useStore.useRegistrationStore.getCurrentCheckInTime(),
                                checkOutTime: useStore.useRegistrationStore.getAfterPlusCheckInTime(),
                            })
                        } else if (useStore.useRegistrationStore.getSwitchStatus() === "custom") {
                            reCheckIn({
                                userId: useStore.useRegistrationStore.getCurrentUserId(),
                                checkInTime: useStore.useRegistrationStore.getCurrentCheckInTime(),
                                checkOutTime: curData.customTime,
                            })
                        } else {
                            console.log("进入其他")
                        }
                        chores();
                    }
                });
            }
        });
    }

    const isMoreThanNDays = (date1, n) => {
        // 将日期转换为时间戳（毫秒）
        var timestamp1 = new Date(date1).getTime();
        var timestamp2 = new Date().getTime();

        // 计算两个日期之间的差值（毫秒）
        var diff = Math.abs(timestamp1 - timestamp2);

        // 将差值转换为天数
        var days = diff / (1000 * 60 * 60 * 24);

        // 检查差值是否超过n天
        return days > n;
    }

    return {
        formRef,
        tableRef,
        tableData,
        searchStatus,
        tableLoading,
        btnLoading,
        selectValue,
        options,
        pagination,
        query,
        shortcuts,
        columns,
        loadingConfig,
        getDataParams,

        onLoading,
        fetchTableData,
        refreshTabaleData,
        addTableData,
        onSizeChange,
        onCurrentChange,
        checkOut,
        handleSearch,
        handleReset,
        handleAdd,
        handleExport,
        isMoreThanNDays,
        openDialog,
    }
}