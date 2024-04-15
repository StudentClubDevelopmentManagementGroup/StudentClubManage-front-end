import { RectNode, RectNodeModel } from "@logicflow/core";
// 自定义节点的 view
export class SeatView extends RectNode {}

// 自定义节点的 model
export class SeatModel extends RectNodeModel {
  setAttributes() {
    const noneLine = {
      message: "座位之间不允许连线",
      validate: () => {
        return false;
      },
    };
    this.sourceRules.push(noneLine);
    this.targetRules.push(noneLine);
  }

}

export const nodeList = [
  {
    text: "座位矩形",
    type: "seat",
    class: "node-rect"
  },
];
