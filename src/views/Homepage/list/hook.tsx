import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router';
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import useStore from '@/store';

import announcementApi from "@/api/announcement.js";

import type { PaginationProps, TableColumns, LoadingConfig } from "@pureadmin/table";

interface TableColumnList extends Array<TableColumns> { }


export function useColumns() {
    const tableData = ref([])
    const tableRef = ref()
    const formRef = ref()
    const searchStatus = ref(false) // 用于检测是否处在检索状态
    const tableLoading = ref(true)
    const btnLoading = ref(false)
    const route = useRoute()

    // 检索区域框输入内容 -- 搜索框逻辑独立于该参数
    const query = ref({
        club_name: "",
        department_id: "",
        author_name: "",
        from_date: null,
        to_date: null,
    })

    /** 分页器配置 */
    const pagination = reactive<PaginationProps>({
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 15, 20, 25],
        total: 0,
        background: true,
        small: false
    });

    /** 表格列配置 */
    const columns: TableColumnList = [
        {
            label: "",
            slot: "myRow",
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
        club_name: searchStatus.value ? query.value.club_name : null,
        author_name: searchStatus.value ? query.value.author_name : null,
        department_id: searchStatus.value ? query.value.department_id : null,
        title_keyword: useStore.homepageStore.getTitleKeyword() ? useStore.homepageStore.getTitleKeyword() : null,
        // from_date: searchStatus.value ? "" : "",
        // to_date: searchStatus.value ? "" : "",
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
            announcementApi
                .getAllNotice(getDataParams.value)
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

    return {
        tableData,
        tableRef,
        formRef,
        searchStatus,
        tableLoading,
        btnLoading,
        query,
        pagination,
        columns,
        loadingConfig,

        fetchTableData,
        onLoading,
        onSizeChange,
        onCurrentChange,
        handleSearch,
        handleReset,
    }
}