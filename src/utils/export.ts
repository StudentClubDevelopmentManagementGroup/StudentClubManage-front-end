import { utils, writeFile } from "xlsx";
import { message } from "@/utils/message";
import formatUtil from "@/utils/formatter";

const exportExcel = (columns, dataList, name: String) => {
  console.log(name)
  const res = dataList.map((item) => {
    const arr = [];
    columns.forEach((column) => {
      if (columnAdpter(column)) {
        if (column.label === "学院") {
          let department_name = "";
          if (item?.department && 'department_name' in item.department) {
            department_name = item.department.department_name;
          } else {
            department_name = item.department_name;
          }
          arr.push(department_name);
        } else if (name === "打卡时长" && column.label === "打卡时长") {
          const {
            attendanceDurationTime
          } = item
          arr.push(formatUtil.formatTime(attendanceDurationTime))
        } else if (name === "签到记录" && column.label === "有效时长") {
          let time = "";
          const {
            checkoutTime,
            isDeleted,
            attendanceDuration,
          } = item
          if (checkoutTime) {
            // 成功签退
            time = formatUtil.formatTime(attendanceDuration)
          } else if (!isDeleted) {
            // 今日已签到，但尚未签退
            time = "待签退"
          } else {
            // 未当日签退的记录
            time = "当天未签退"
          }
          arr.push(time)
        } else if (column?.slot === "role") {
          let roleList = [];
          let roleString = "";
          const {
            role: {
              is_club_manager,
              is_club_member,
              is_student,
              is_super_admin,
              is_teacher,
            },
          } = item;

          if (is_club_manager) {
            roleList.push("负责人");
          } else if (is_club_member) {
            roleList.push("普通成员");
          }

          if (is_teacher) {
            roleList.push("教师");
          } else {
            roleList.push("学生");
          }

          if (is_super_admin) {
            roleList.push("超级管理员");
          }

          roleString = roleList.join(",");
          arr.push(roleString);
        } else {
          arr.push(item[column.prop as string]);
        }
      }
    });
    return arr;
  });
  const titleList = [];
  columns.forEach((column) => {
    if (columnAdpter(column)) {
      titleList.push(column.label);
    }
  });
  res.unshift(titleList);


  // 添加备注行到结果集末尾  
  const noteRow = ["备注:TRUE 表示 肯定;FALSE 表示 否定"];
  res.push(noteRow);

  const workSheet = utils.aoa_to_sheet(res);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "数据表");
  writeFile(workBook, `${name}.xlsx`);
  message("导出成功", {
    type: "success",
  });
};

function columnAdpter(column) {
  return !(column.label === "勾选列" || column.slot === "operation");
}

export { exportExcel };
