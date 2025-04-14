
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";
import { reactive } from "vue";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 需求人数、提问数量、解决数量、用户满意度 */
const chartData = reactive([
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "基地人数",
    value: 180,
    percent: "+33%",
    data: [100, 134, 124, 90, 140, 133, 180] // 平滑折线图数据
  },
  {
    icon: Question,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "签到时长",
    value: 80,
    percent: "+10%",
    data: [16, 48, 55, 88, 21, 73, 79]
  },
  {
    icon: CheckLine,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "活动数量",
    value: 99,
    percent: "-20%",
    data: [61, 102, 95, 15, 66, 15, 45]
  }
]);

/** 分析概览 */
const barChartData = reactive([
  {
    requireData: [2101, 5288, 4239, 4962, 6752, 5208, 7450,2101, 3280, 4400, 4962, 5752, 6889, 7600],
    questionData: [2216, 1148, 1255, 1788, 4821, 1973, 4379,2116, 3148, 3255, 3788, 4821, 4970, 5390]
  },

]);

/** 解决概率 */
const progressData = reactive([
  {
    week: "周一",
    percentage: 85,
    duration: 110,
    color: "#41b6ff"
  },
  {
    week: "周二",
    percentage: 86,
    duration: 105,
    color: "#41b6ff"
  },
  {
    week: "周三",
    percentage: 88,
    duration: 100,
    color: "#41b6ff"
  },
  {
    week: "周四",
    percentage: 89,
    duration: 95,
    color: "#41b6ff"
  },
  {
    week: "周五",
    percentage: 94,
    duration: 90,
    color: "#26ce83"
  },
  {
    week: "周六",
    percentage: 96,
    duration: 85,
    color: "#26ce83"
  },
  {
    week: "周日",
    percentage: 100,
    duration: 80,
    color: "#26ce83"
  }
].reverse());


export { chartData, barChartData, progressData };
