import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { clubFormItemProps } from "./types"
import { delay } from "@pureadmin/utils";
import { ref, reactive, computed, onMounted, h } from "vue";
import { message } from "@/utils/message";
import managementApi from "@/api/management";
import useStore from "@/store";

import addForm from "../clubAddForm.vue";
import setForm from "../clubSetForm.vue";
import deleteForm from "../clubDeleteForm.vue"
import { addDialog, closeDialog } from "@/components/Dialog";
import { deviceDetection } from "@pureadmin/utils";

interface TableColumnList extends Array<TableColumns> { }

export default function useColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const btnDeleteStatus = computed(() => useStore.useClubStore.getCheckboxStatus())
    const deleteState = computed(() => useStore.useClubStore.getDeleteState())

    // 搜索框输入内容
    const query = ref({
        name: "",
        departmentId: ""
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
            label: "社团/基地名称",
            prop: "name",
            minWidth: 100,
        },
        {
            label: "学院",
            prop: "department_name",
            minWidth: 150,
        },
        {
            label: "成员数",
            prop: "number",
            width: 100,
        },
        {
            label: "社团负责人",
            prop: "manager",
            cellRenderer: ({ row }) => <div> {row.manager === null ? "未设置" : row.manager}</div>,
        },
        {
            label: "招新状态",
            prop: "state",
            cellRenderer: ({ row }) => {
                if (!row.state) {
                    // 招新中
                    return <el-tag type="success">招新中</el-tag>
                } else {
                    // 暂停招新
                    return <el-tag type="info">停止招新</el-tag>
                }
            }
        },
        {
            label: "启用状态",
            prop: "is_deleted",
            cellRenderer: ({ row }) => {
                if (row.is_deleted) {
                    // 已逻辑删除
                    return <el-tag type="danger">未启用</el-tag>
                } else {
                    // 启用中
                    return <el-tag type="success">启用中</el-tag>
                }
            }
        },
        {
            label: "操作",
            fixed: "right",
            width: 350,
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
        department_id: searchStatus.value && query.value.departmentId !== "" ? query.value.departmentId : 0,
        name: searchStatus.value ? query.value.name : "",
        pageNum: pagination.currentPage,
        size: pagination.pageSize
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
            managementApi.getBaseList(getDataParams.value)
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
    }

    // 刷新数据
    const refreshTabaleData = () => {
        onLoading()
        fetchTableData();
    }

    // 新增基地
    const addClub = (val) => {
        return new Promise((resolve, reject) => {
            managementApi.addBase(val)
                .then((data) => {
                    message("添加基地/社团成功", { type: "success" })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("添加基地/社团失败", { type: "error" })
                    console.warn(error.message)
                })
        })
    }

    // 删除基地/社团
    const deleteClub = (val) => {
        return new Promise((resolve, reject) => {
            managementApi.deleteBase(val)
                .then((data) => {
                    message("删除基地/社团成功", { type: "success" })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("添加基地/社团失败", { type: "error" })
                    console.warn(error);
                })
        })
    }

    // 恢复基地/社团
    const undeleteClub = (val) => {
        return new Promise((resolve, reject) => {
            managementApi.undeleteBase(val)
                .then((data) => {
                    message("恢复基地/社团成功", { type: "success" })
                    console.log("data", data)
                })
                .catch((error) => {
                    console.warn(error);
                })
        })
    }

    // 设置负责人
    const setManager = (val) => {
        return new Promise((resolve, reject) => {
            managementApi.setManager(val)
                .then((data) => {
                    message("设置负责人成功", { type: 'success' })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("设置负责人失败", { type: 'success' })
                    console.warn(error);

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

    // 处理恢复
    const handleUnDelete = (row) => {
        undeleteClub({
            name: row.name,
            department_id: row.department_id
        })
        onLoading()
        fetchTableData()
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

    function openDialog(title, item, row?: clubFormItemProps) {
        var state = 0
        if (title === "新增基地/社团") {
            state = 1
        } else if (title === "设置教师负责人") {
            state = 2
        }
        addDialog({
            title: title,
            props: {
                formInline: {
                    name: row?.name ?? "",
                    department_id: row?.department_id ?? "",
                    user_id: row?.user_id ?? "",
                }
            },
            width: "40%",
            draggable: true,
            fullscreen: deviceDetection(),
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => {
                if (state === 1) {
                    return h(addForm, { ref: formRef })
                } else if (state === 2) {
                    return h(setForm, { ref: formRef })
                }
            },
            beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as clubFormItemProps;
                function chores() {
                    done(); // 关闭弹框
                }
                FormRef.validate((valid: any) => {
                    if (valid) {
                        if (state === 1) {
                            addClub({
                                name: curData.name,
                                department_id: curData.department_id
                            })
                        } else if (state === 2) {
                            setManager({
                                user_id: curData.user_id,
                                club_id: item.club_id,
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

    function openDeleteDialog(title, item) {
        addDialog({
            title: title,
            width: "30%",
            draggable: true,
            closeOnClickModal: false,
            // hideFooter: true,
            contentRenderer: ({ options, index }) => {
                return h(deleteForm, { ref: formRef })
            },
            footerRenderer: ({ options, index }) => {
                return <div>
                    {deleteState.value === 1 && (
                        <el-button
                            onClick={() => {
                                useStore.useClubStore.setDeleteState(2);
                            }}
                            class='w-full'
                            disabled={!btnDeleteStatus.value}
                        >
                            我已阅读注意事项
                        </el-button>
                    )}
                    {deleteState.value === 2 && (
                        <el-button
                            onClick={() => {
                                closeDialog(options, index, { command: "footer" });
                            }}
                            type='danger'
                            class='w-full'
                        >
                            确认删除
                        </el-button>
                    )}
                </div>
            },
            closeCallBack({ options, index, args }) {
                if (args.command === "footer") {
                    deleteClub({
                        name: item.name,
                        department_id: item.department_id
                    })
                }
            },
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
        onSizeChange,
        onCurrentChange,
        handleSearch,
        handleReset,
        handleUnDelete,
        handleExport,
        openDialog,
        openDeleteDialog
    }
}