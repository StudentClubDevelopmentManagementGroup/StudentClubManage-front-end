import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";
import type { clubFormItemProps, departmentItemProps, userItemProps } from "./types"
import { delay } from "@pureadmin/utils";
import { ref, reactive, computed, onMounted, h } from "vue";
import { message } from "@/utils/message";
import baseApi from "@/api/base";
import memberApi from "@/api/member";
import departmentApi from "@/api/department"
import userinfoApi from "@/api/userinfo"
import userApi from "@/api/user"
import useStore from "@/store";

import clubAddForm from "../clubAddForm.vue";
import clubSetForm from "../clubSetForm.vue";
import clubDeleteForm from "../clubDeleteForm.vue"
import departmentAddForm from "../departmentAddForm.vue"
import departmentUpdateForm from "../departmentUpdateForm.vue"
import departmentDeleteForm from "../departmentDeleteForm.vue"
import userUpdatePwdForm from "../userUpdatePwdForm.vue"

import { addDialog, closeDialog } from "@/components/Dialog";
import { deviceDetection } from "@pureadmin/utils";

interface TableColumnList extends Array<TableColumns> { }

export function useClubColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const btnDeleteStatus = computed(() => useStore.clubStore.getCheckboxStatus())
    const deleteState = computed(() => useStore.clubStore.getDeleteState())

    // 搜索框输入内容
    const query = ref({
        club_name: "",
        department_id: ""
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
            prop: "club_name",
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
        department_id: searchStatus.value && query.value.department_id !== "" ? query.value.department_id : 0,
        club_name: searchStatus.value ? query.value.club_name : "",
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
            baseApi.getBaseList(getDataParams.value)
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
    const addClub = (val: { club_name: string, department_id: string | number }) => {
        return new Promise((resolve, reject) => {
            baseApi.addBase(val)
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
    const deleteClub = (val: { club_name: string, department_id: string | number }) => {
        return new Promise((resolve, reject) => {
            baseApi.deleteBase(val)
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
    const undeleteClub = (val: { club_name: string, department_id: string | number }) => {
        return new Promise((resolve, reject) => {
            baseApi.undeleteBase(val)
                .then((data) => {
                    message("恢复基地/社团成功", { type: "success" })
                })
                .catch((error) => {
                    console.warn(error);
                })
        })
    }

    // 设置负责人
    const setManager = (val: { user_id: string | number, club_id: number }) => {
        return new Promise((resolve, reject) => {
            memberApi.setManager(val)
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
            club_name: row.club_name,
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
                    club_name: row?.club_name ?? "",
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
                    return h(clubAddForm, { ref: formRef })
                } else if (state === 2) {
                    return h(clubSetForm, { ref: formRef })
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
                                club_name: curData.club_name,
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
                return h(clubDeleteForm, { ref: formRef })
            },
            footerRenderer: ({ options, index }) => {
                return <div>
                    {deleteState.value === 1 && (
                        <el-button
                            onClick={() => {
                                useStore.clubStore.setDeleteState(2);
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
                        club_name: item.club_name,
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

    // 导出Excel
    // TODO:导出EXCEL
    const handleExport = () => {
        console.log("导出Excel")
    }

    onMounted(() => {
        onLoading()
        fetchTableData();
    });

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
        onSizeChange,
        onCurrentChange,
        handleSearch,
        handleReset,
        handleExport,
        openDialog,
        openDeleteDialog
    }
}

export function useUserColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const radioStatus = computed(() => useStore.publicStore.getRadioStatus())

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
            type: "expand",
            slot: "expand"
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

    // 导出Excel
    // TODO:导出EXCEL
    const handleExport = () => {
        console.log("导出Excel")
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

    onMounted(() => {
        onLoading()
        fetchTableData();
    });

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
                                    pwd: useStore.publicStore.getDefaultPwd()
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

    function openDeleteDialog(title, item) {
        addDialog({
            title: title,
            width: "30%",
            draggable: true,
            closeOnClickModal: false,
            // hideFooter: true,
            contentRenderer: ({ options, index }) => {
                return h(clubDeleteForm, { ref: formRef })
            },
            footerRenderer: ({ options, index }) => {
                return <div></div>
            },
            closeCallBack({ options, index, args }) {
                if (args.command === "footer") {
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
        handleExport,
        openDialog,
        openDeleteDialog
    }
}