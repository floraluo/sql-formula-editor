export function initFilterCondition() { //已废弃
  return [
    {
      left: null,
      right: null,
      leftFormula: {},
      rightFormula: {},
      relation: null,
      arg1: null
    }
  ]
}

export function findDepend({nodes, newField, dependedField,dependFields}){
  nodes.forEach(node => {
    if (node.type === 'self-field' && node.fieldColumnName === dependedField.fieldColumnName) {
      dependFields.push(newField);
    } else if (node.params || node.nodes) {
      let nodes = node.params || node.nodes
      findDepend({nodes, newField, dependedField,dependFields});
    }
  })
}

export let customField = {
  fieldShowName: '自定义',
  fieldDisplayName: '自定义',
  fieldColumnName: 'c_custom',
  id: 'c_custom',
  custom: true
}
export function initBaseFilterConditionGroup() { 
  const group = initGroupNode();
  group.children.push(initConditionNode());
  return group;
}
export function initConditionNode() {
  return {
    id: Math.random().toString(16),
    type: 'condition',
    left: {},
    right: {},
    leftFormula: {},
    rightFormula: {},
    relation: null,
    arg1: null,
  }
}
export function initConditionalGroupNode() { 
  return {
    id: Math.random().toString(16),
    type: 'group',
    groupRelation: 'and',
    children: [initConditionNode()],
  }
}
export function initGroupNode() {
  return {
    id: Math.random().toString(16),
    type: 'group',
    groupRelation: 'and',
    children: [],
  }
}
export function initModal(modalData) { 
  const { type, bizId } = modalData;
  let modal = {
    quota: {
      type,
      bizId,
      title: '指标信息',
      fieldNameLabel: '指标名称',
      fieldListLabel: "指标区域"
    },
    attribute: {
      type,
      bizId,
      title: '属性信息',
      fieldNameLabel: '属性名称',
      fieldListLabel: "属性区域"
    },
    field: {
      type,
      title: '自定义字段',
      fieldNameLabel: '自定义字段名称',
      fieldListLabel: "字段区域"
    }
  }
  return modal[type];
}
// let conditionNode = {
//   type: 'condition',
//   left: null,
//   right: null,
//   leftFormula: {},
//   rightFormula: {},
//   relation: null,
//   arg1: null
// }
// let groupNode = {
//   type: 'group',
//   relation: 'and/or',
//   children: [conditionNode,groupNode]
// }

