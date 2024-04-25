import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";

const exportExcel = (columns, dataList, name: String) => {
  const res = dataList.value.map((item) => {
    const arr = [];
    columns.forEach((column) => {
      if (!columnAdpter(column)) {
        if (column.label === "学院") {
          const {
            department: { department_name },
          } = item;
          arr.push(department_name);
        } else {
          arr.push(item[column.prop as string]);
        }
      }
    });
    return arr;
  });
  const titleList = [];
  columns.forEach((column) => {
    if (!columnAdpter(column)) {
      titleList.push(column.label);
    }
  });
  res.unshift(titleList);
  const workSheet = utils.aoa_to_sheet(res);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "数据表");
  writeFile(workBook, `${name}.xlsx`);
  message("导出成功", {
    type: "success",
  });
};

function columnAdpter(column) {
  if (column.label === "勾选列" || column.slot) return true;
}

export { exportExcel };
