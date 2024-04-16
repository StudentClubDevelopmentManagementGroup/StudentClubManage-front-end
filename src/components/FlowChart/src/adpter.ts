function convertDateToMemberNode(data) {
  const { seat_id, x, y, description, arranger, owner } = data;
  return {
    id: seat_id,
    type: "seat",
    x: x,
    y: y,
    properties: {
      text: description,
      ...arranger,
      owner,
    },
    baseType: "node",
    
  };
}

function convertDateToNode(data) {
  const { seat_id, x, y, description, arranger, owner } = data;
  return {
    id: seat_id,
    type: "seat",
    x: x,
    y: y,
    properties: {
      arranger,
      ...owner,
      description
    },
    baseType: "node",
    text: owner?.name ?? "",
  };
}

export function toNodeData(data) {
  const turboData = {
    nodes: [],
    edges: [],
  };
  data.nodes.forEach((node) => {
    const flowElement = convertDateToNode(node);
    turboData.nodes.push(flowElement);
  });

  return turboData;
}

export function toMemberNodeData(data) {
  const turboData = {
    nodes: [],
    edges: [],
  };
  data.nodes.forEach((node) => {
    const flowElement = convertDateToMemberNode(node);
    turboData.nodes.push(flowElement);
  });

  return turboData;
}