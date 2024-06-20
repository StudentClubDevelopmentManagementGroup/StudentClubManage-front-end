import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { departmentItemProps } from "./types"

import { ref, reactive, computed, onMounted, h } from "vue";
import { message } from "@/utils/message";
import { delay } from "@pureadmin/utils";
import { deviceDetection } from "@pureadmin/utils";
import { addDialog, closeDialog } from "@/components/Dialog";
import departmentApi from "@/api/department"
import useStore from "@/store";

import departmentAddForm from "./departmentAddForm.vue"
import departmentUpdateForm from "./departmentUpdateForm.vue"
import departmentDeleteForm from "./departmentDeleteForm.vue"


interface TableColumnList extends Array<TableColumns> { }

export function useDepartmentColumns() {
    const tableData = ref([]) // 原始数据
    const tmpData = ref([]) // 中间数据
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const btnDeleteStatus = computed(() => useStore.departmentStore.getCheckboxStatus())
    const deleteState = computed(() => useStore.departmentStore.getDeleteState())

    // 搜索框输入内容
    const query = ref({
        fullName: "",
        abbreviation: "",
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

    const computeTableData = computed(() => {
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return tmpData.value.slice(start, end);
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
            label: "学院序号",
            prop: "id",
            minWidth: 90,
        },
        {
            label: "学院全称",
            prop: "fullName",
            minWidth: 100,
        },
        {
            label: "学院简称",
            prop: "abbreviation",
            minWidth: 140,
        },
        {
            label: "操作",
            fixed: "right",
            width: 200,
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
    const getDataParams = computed(() => ({}))

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
        delay(1000).then(() => {
            pagination.pageSize = val
            tableLoading.value = false;
        })
    }

    // 换页
    function onCurrentChange(val) {
        loadingConfig.text = `正在加载第${val}页...`;
        delay(1000).then(() => {
            pagination.currentPage = val;
            tableLoading.value = false;
        })
    }

    // 获取数据
    const fetchTableData = () => {
        return new Promise((resolve, reject) => {
            departmentApi.getAllDepartment()
                .then((data) => {
                    tableData.value = data;
                    if (searchStatus.value) {
                        // 检索状态
                        tmpData.value = tableData.value.filter(obj =>
                            Object.keys(query.value).every(
                                key => query.value[key] === "" || obj[key].includes(query.value[key])
                            )
                        )
                    } else {
                        // 无检索状态
                        tmpData.value = tableData.value;
                    }
                    pagination.total = tmpData.value.length;
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

    // 新增学院
    const addDepartment = (val: { abbreviation: string, fullName: string }) => {
        return new Promise((resolve, reject) => {
            departmentApi.addDepartment(val)
                .then((data) => {
                    message("添加学院成功", { type: "success" })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("添加学院失败", { type: "error" })
                    console.warn(error.message)
                })
        })
    }

    // 修改学院信息
    const updateDepartment = (val: { id: string | number, fullName: string }) => {
        return new Promise((resolve, reject) => {
            departmentApi.updateDepartment(val)
                .then((data) => {
                    message("修改学院信息成功", { type: "success" })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("修改学院信息失败", { type: "error" })
                    console.warn(error.message)
                })
        })
    }

    // 删除学院
    const deleteDepartment = (val: string) => {
        return new Promise((resolve, reject) => {
            departmentApi.deleteDepartment(val)
                .then((data) => {
                    message("删除成功", { type: "success" })
                    onLoading()
                    fetchTableData()
                })
                .catch((error) => {
                    message("删除失败", { type: "error" })
                    console.warn(error.message)
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
        }
        onLoading()
        fetchTableData()
    }

    function openDialog(title, item, row?: departmentItemProps) {
        var state = 0
        if (title === "新增学院") {
            state = 1
        } else if (title === "修改学院信息") {
            state = 2
        }
        addDialog({
            title: title,
            props: {
                formInline: {
                    fullName: row?.fullName ?? "",
                    abbreviation: row?.abbreviation ?? ""
                }
            },
            width: "40%",
            draggable: true,
            fullscreen: deviceDetection(),
            fullscreenIcon: true,
            closeOnClickModal: false,
            contentRenderer: () => {
                if (state === 1) {
                    return h(departmentAddForm, { ref: formRef })
                } else if (state === 2) {
                    return h(departmentUpdateForm, { ref: formRef })
                }
            },
            beforeSure: (done, { options }) => {
                const FormRef = formRef.value.getRef();
                const curData = options.props.formInline as departmentItemProps;
                function chores() {
                    done(); // 关闭弹框
                }
                FormRef.validate((valid: any) => {
                    if (valid) {
                        if (state === 1) {
                            addDepartment({
                                fullName: curData.fullName,
                                abbreviation: curData.abbreviation
                            })
                        } else if (state === 2) {
                            updateDepartment({
                                id: item.id,
                                fullName: curData.fullName
                            })
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
                return h(departmentDeleteForm, { ref: formRef })
            },
            footerRenderer: ({ options, index }) => {
                return <div>
                    {deleteState.value === 1 && (
                        <el-button
                            onClick={() => {
                                useStore.departmentStore.setDeleteState(2);
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
                    deleteDepartment(item.fullName)
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
        computeTableData,
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
        openDeleteDialog
    }
}