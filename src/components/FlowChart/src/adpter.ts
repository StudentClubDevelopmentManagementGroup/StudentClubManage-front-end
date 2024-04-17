function convertDataToMemberNode(data) {
  const { seat_id, x, y, description, arranger, owner } = data;
  return {
    id: seat_id,
    type: "seat",
    x: x,
    y: y,
    properties: {
      text: description,
      arranger,
      ...owner,
    },
    baseType: "node",
  };
}

function convertDataToNode(data) {
  const { seat_id, x, y, description, arranger, owner } = data;
  return {
    id: seat_id,
    type: "seat",
    x: x,
    y: y,
    properties: {
      arranger,
      ...owner,
      description,
    },
    baseType: "node",
    text: owner?.name ?? "空座",
  };
}

function convertNodeToSeat(data) {
  const { id, x, y, properties } = data;
  return {
    seat_id: id,
    x,
    y,
    description: properties.description,
    owner_id: properties.user_id,
    unset_owner: properties.user_id ? false : true,
  };
}

export function toNodeData(data) {
  const turboData = {
    nodes: [],
    edges: [],
  };
  data.forEach((node) => {
    const flowElement = convertDataToNode(node);
    turboData.nodes.push(flowElement);
  });

  return turboData;
}

export function toMemberNodeData(data) {
  const turboData = {
    nodes: [],
    edges: [],
  };
  data.forEach((node) => {
    const flowElement = convertDataToMemberNode(node);
    turboData.nodes.push(flowElement);
  });

  return turboData;
}

export function toSeatData(data) {
  const seat_list = [];
  data.forEach((node) => {
    const flowElement = convertNodeToSeat(node);
    seat_list.push(flowElement);
  });

  return seat_list;
}
