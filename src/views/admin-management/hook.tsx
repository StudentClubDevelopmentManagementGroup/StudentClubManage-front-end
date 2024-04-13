import type { TableColumns } from "@pureadmin/table";
interface TableColumnList extends Array<TableColumns> {}

export const columns: TableColumnList = [
    {
        label: "勾选列", // 如果需要表格多选，此处label必须设置
        type: "selection",
        fixed: "left",
        reserveSelection: true // 数据刷新后保留选项
    },
    {
        label: "基地/社团名称",
        prop: "name",
        minWidth: 90
    },
    {
        label: "学院名称",
        prop: "department_name",
        minWidth: 100
    },
    {
        label: "总人数",
        prop: "number",
    },
    {
        label: "启用状态",
        prop: "is_deleted",
        minWidth: 100,
        cellRenderer: ({ row, props }) => (
            <el-tag type={!row.is_deleted ? 'success' : 'danger'}>{
                !row.is_deleted ? "启用" : "未启用"
            }</el-tag>
        )
    },
    {
        label: "招新状态",
        prop: "state",
        minWidth: 100,
        cellRenderer: ({ row, props }) => (
            <el-tag type={!row.state ? 'success' : 'danger'}>{
                !row.state ? "正在招新" : "终止招新"
            }</el-tag>
        )
    }, {
        label: "操作",
        fixed: "right",
        slot: "operation",
    },
];