import type { TableColumns } from "@pureadmin/table";

declare global {
  interface TableColumnList extends Array<TableColumns> {}
}
