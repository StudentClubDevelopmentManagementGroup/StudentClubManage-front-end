import {
  HtmlNode,
  HtmlNodeModel,
  h,
  RectNode,
  RectNodeModel,
} from "@logicflow/core";


// 自定义节点的 view
export class MemberView extends HtmlNode {
  currrentid: string;
  shouldUpdate() {
    const { id } = this.props.model;
    if (typeof this.currrentid === "undefined") return true;
    if (this.currrentid && this.currrentid === id) return false;
    this.currrentid = id;
    return true;
  }

  setHtml(rootEl: HTMLElement) {
    const { properties, text } = this.props.model;
    const node_md = this.props.model;

    if (!this.shouldUpdate()) return;

    const el = document.createElement("div");
    el.className = "box";
    el.id = node_md.id;

    const html = `
      <div class="box-title">
        <svg width="20" height="20" viewBox="0 0 1274 1024" fill="#4091f7">
          <path :fill="stroke" d="M792.576 379.392a25.6 25.6 0 0 0 25.2928 25.8048h283.2384A25.6 25.6 0 0 0 1126.4 379.392a25.6 25.6 0 0 0-25.2928-25.8048h-283.2384a25.6 25.6 0 0 0-25.344 25.8048z m303.9232 80.7424H761.856c-16.5376 0-29.9008 11.6224-29.9008 25.7536 0 14.1824 13.312 25.7536 29.9008 25.7536h334.6432c16.4864 0 29.9008-11.5712 29.9008-25.7536 0-14.1312-13.4144-25.7536-29.9008-25.7536z m4.608 106.496h-283.2384a25.6 25.6 0 0 0-25.344 25.7536 25.6 25.6 0 0 0 25.344 25.7536h283.2384A25.6 25.6 0 0 0 1126.4 592.384a25.6 25.6 0 0 0-25.2928-25.8048zM543.0272 1024H341.6576C150.8352 1024 0 1024 0 923.648v-20.1216c0-188.16 153.2928-341.1968 341.7088-341.1968h201.2672c188.416 0 341.76 153.0368 341.76 341.1968v20.0704C884.6848 1024 726.3232 1024 542.976 1024z m-203.1616-405.1456c-158.464 0-287.4368 128.4096-287.4368 286.208v20.48c0 40.9088 166.0928 40.9088 287.4368 40.9088h204.9536c100.4544 0 287.4368 0 287.4368-40.96v-20.3776c0-157.8496-128.9728-286.208-287.4368-286.208H339.8656z m92.416-76.7488a271.4112 271.4112 0 0 1-271.2064-271.0528A271.36 271.36 0 0 1 432.2816 0a271.36 271.36 0 0 1 271.2064 271.0528 271.4624 271.4624 0 0 1-271.2064 271.0528z m-215.3472-271.872c0 118.1696 96.6144 214.3232 215.3472 214.3232 118.784 0 215.3984-96.1536 215.3984-214.3232 0-118.2208-96.6144-214.3232-215.3984-214.3232S216.9344 152.0128 216.9344 270.2336z"/>
        </svg>
        <span>${properties.name??"空座"}</span>
      </div>
      <div class="box-content">
        <span>备注:${properties.text}</span>
      </div>
    `;
    el.innerHTML = html;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = "";
    rootEl.appendChild(el);
  }
}

// 自定义节点的 model
export class MemberModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false;
    const size = 60;
    this.width = size + 20;
    this.height = size;
    this.anchorsOffset = [
      [this.width / 2, 0],
      [-this.width / 2, 0],
    ];

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

export class SeatView extends RectNode {
  getShape() {
    const { model } = this.props;
    const { width, height, x, y } = model;
    const { fill, stroke, strokeWidth } = model.getNodeStyle();
    const attrs = {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      stroke: "#4091f7",
      fill,
      strokeWidth,
    };
    return h("g", {}, [
      h("rect", { ...attrs }),
      h(
        "svg",
        {
          x: x - width / 2 + 5,
          y: y - height / 2 + 5,
          width: 20,
          height: 20,
          viewBox: "0 0 1274 1024",
        },
        h("path", {
          fill: stroke,
          d: "M792.576 379.392a25.6 25.6 0 0 0 25.2928 25.8048h283.2384A25.6 25.6 0 0 0 1126.4 379.392a25.6 25.6 0 0 0-25.2928-25.8048h-283.2384a25.6 25.6 0 0 0-25.344 25.8048z m303.9232 80.7424H761.856c-16.5376 0-29.9008 11.6224-29.9008 25.7536 0 14.1824 13.312 25.7536 29.9008 25.7536h334.6432c16.4864 0 29.9008-11.5712 29.9008-25.7536 0-14.1312-13.4144-25.7536-29.9008-25.7536z m4.608 106.496h-283.2384a25.6 25.6 0 0 0-25.344 25.7536 25.6 25.6 0 0 0 25.344 25.7536h283.2384A25.6 25.6 0 0 0 1126.4 592.384a25.6 25.6 0 0 0-25.2928-25.8048zM543.0272 1024H341.6576C150.8352 1024 0 1024 0 923.648v-20.1216c0-188.16 153.2928-341.1968 341.7088-341.1968h201.2672c188.416 0 341.76 153.0368 341.76 341.1968v20.0704C884.6848 1024 726.3232 1024 542.976 1024z m-203.1616-405.1456c-158.464 0-287.4368 128.4096-287.4368 286.208v20.48c0 40.9088 166.0928 40.9088 287.4368 40.9088h204.9536c100.4544 0 287.4368 0 287.4368-40.96v-20.3776c0-157.8496-128.9728-286.208-287.4368-286.208H339.8656z m92.416-76.7488a271.4112 271.4112 0 0 1-271.2064-271.0528A271.36 271.36 0 0 1 432.2816 0a271.36 271.36 0 0 1 271.2064 271.0528 271.4624 271.4624 0 0 1-271.2064 271.0528z m-215.3472-271.872c0 118.1696 96.6144 214.3232 215.3472 214.3232 118.784 0 215.3984-96.1536 215.3984-214.3232 0-118.2208-96.6144-214.3232-215.3984-214.3232S216.9344 152.0128 216.9344 270.2336z",
        })
      ),
    ]);
  }
}

export class SeatModel extends RectNodeModel {
  setAttributes() {
    this.text.editable = false;
    const size = 60;
    this.width = size + 20;
    this.height = size;
    this.anchorsOffset = [
      [this.width / 2, 0],
      [-this.width / 2, 0],
    ];

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
    class: "node-rect",
  },
];
