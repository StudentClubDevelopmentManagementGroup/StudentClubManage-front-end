import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { userItemProps } from "./types"

import { ref, reactive, computed, h } from "vue";
import { message } from "@/utils/message";
import { delay } from "@pureadmin/utils";
import { deviceDetection } from "@pureadmin/utils";
import { addDialog } from "@/components/Dialog";
import userinfoApi from "@/api/userinfo"
import useStore from "@/store";

import userUpdatePwdForm from "./userUpdatePwdForm.vue"

interface TableColumnList extends Array<TableColumns> { }

export function useUserColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const radioStatus = computed(() => useStore.adminStore.getRadioStatus())

    // 搜索框输入内容
    const query = ref({
        user_id: "",
        user_name: "",
        department_id: "",
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
            label: "用户ID",
            prop: "user_id",
            minWidth: 80,
        },
        {
            label: "用户名",
            prop: "name",
            minWidth: 60,
        },
        {
            label: "学院",
            minWidth: 100,
            cellRenderer: ({ row }) => row.department.department_name,
        },
        {
            label: "电话",
            prop: "tel",
            minWidth: 80,
        },
        {
            label: "邮箱",
            prop: "mail",
            minWidth: 80,
        },
        {
            label: "拥有角色",
            slot: 'role',
            minWidth: 100,
        },
        {
            label: "操作",
            fixed: "right",
            width: 120,
            slot: "operation",
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
        user_id: searchStatus.value ? query.value.user_id : "",
        user_name: searchStatus.value ? query.value.user_name : "",
        department_id: searchStatus.value && query.value.department_id !== "" ? query.value.department_id : 0,
        page_num: pagination.currentPage,
        page_size: pagination.pageSize
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
        return new Promise((resolve, reject) => {
            userinfoApi.getUserList(getDataParams.value)
                .then((data) => {
                    tableData.value = data.records;
                    pagination.total = parseInt(data.total_item);
                    resolve(data)
                })
                .catch((error) => {
                    tableData.value = [];
                    pagination.total = 0;
                    reject(error)
                })
                .finally(() => {
                    tableLoading.value = false;
                })
        })
    }

    // 刷新数据
    const refreshTabaleData = () => {
        onLoading()
        fetchTableData();
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

    // 更改密码
    const changePwd = (val: { user_id: string | number, pwd: string }) => {
        console.log("val", val)
        return new Promise((resolve, reject) => {
            userinfoApi.updatePwd(val)
                .then((data) => {
                    message("成功修改密码", { type: "success" })
                })
                .catch((error) => {
                    message("修改密码失败,请重新尝试", { type: "error" })
                    console.warn(error)
                })
        })
    }

    function openDialog(title, item, row?: userItemProps) {
        var state = 0
        if (title === "修改密码") {
            state = 1
        }
        addDialog({
            title: title,
            props: {
                formInline: {
                    pwd: row?.pwd ?? "",
                    rePwd: row?.rePwd ?? "",
                }
            },
            width: "40%",
            draggable: true,
            fullscreen: deviceDetection(),
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => {
                if (state === 1) {
                    return h(userUpdatePwdForm, { ref: formRef })
                }
            },
            beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as userItemProps;
                function chores() {
                    done(); // 关闭弹框
                }
                FormRef.validate((valid: any) => {
                    if (valid) {
                        if (state === 1) {
                            if (radioStatus.value) {
                                // 预设密码
                                changePwd({
                                    user_id: item.user_id,
                                    pwd: useStore.adminStore.getDefaultPwd()
                                })
                            } else {
                                // 自定义密码
                                changePwd({
                                    user_id: item.user_id,
                                    pwd: curData.pwd
                                })
                            }
                        } else {
                            console.log("进入其他")
                        }
                        chores();
                    }
                });
            }
        });
    }

    return {
        formRef,
        tableRef,
        tableData,
        searchStatus,
        tableLoading,
        btnLoading,
        pagination,
        query,
        columns,
        loadingConfig,
        getDataParams,

        fetchTableData,
        refreshTabaleData,
        onLoading,
        onSizeChange,
        onCurrentChange,
        handleSearch,
        handleReset,
        openDialog,
    }
}