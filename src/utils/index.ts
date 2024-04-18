import { utils, writeFile } from "xlsx";
import { message } from "./message";

export const exportExcel = (columns, dataList, name: String) => {
  const res = dataList.value.map((item) => {
    const arr = [];
    columns.forEach((column) => {
      arr.push(item[column.prop as string]);
    });
    return arr;
  });
  const titleList = [];
  columns.forEach((column) => {
    titleList.push(column.label);
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
