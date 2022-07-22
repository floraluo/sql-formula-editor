import editorButtonsMap from '@/lib/editorButtonsMap'
import { deepCopy } from '@/lib/util'

import checkFieldLegal from './checkFieldLegal'
export default function (nodes, fieldList) {
  const copyNode = deepCopy(nodes);
  return copyNode.map((node, index) => {
    return parseNode({node, path:String(index), place: 'rootChildren', fieldList});
  })
}

function parseNode({node, path, place, fieldList}) {
  const baseNode = { 
    ...node,
    path,
    type: node.type,
    category: node.type,
    renderType: node.type,
    paramsType: node.type,
    place
  };
  const parseNodeRenderModelMap = {
    'fix-params-method': renderMethodModel,
    'dynamic-params-method': renderMethodModel,
    'operator': renderTextModel,
    'if': renderIfModel,
    'case': renderCaseModel,
    'digit': renderTextModel,
    'constant': renderTagModel,
    'field': renderTagModel,
    'self-field': renderTagModel,
    'system': renderTagModel,
    'data-type': renderDataTypeModel
  }
  const paramsType = node.type;
  const expandNode = parseNodeRenderModelMap[paramsType]({ node, paramsType, path, fieldList });
  return Object.assign(baseNode, expandNode);
}
function renderTextModel({ node, paramsType }) {
  const baseNode = {
    renderType: 'text'
  }
  if (paramsType === 'operator') {
    baseNode.exportChar = editorButtonsMap.btnGroup.find(btn => btn.name === node.name).exportChar
  }
  return baseNode;
}
function renderTagModel({ node, paramsType, fieldList }) {
  const baseNode = {
    renderType: 'tag'
  };
  if (paramsType == 'system') {
    const systemBtn = editorButtonsMap.btnGroup.find(btn => btn.value === node.value);
    Object.assign(baseNode, { ...systemBtn })
  } else if (paramsType === 'constant') {
    baseNode.category = 'constant';
    baseNode.disabled = true;
    baseNode.tooltipVisible = false;
  }else if (paramsType === 'self-field') {
    baseNode.category = 'field';
  } else if (paramsType === 'field') {
    baseNode.category = 'field';
    if (fieldList !== undefined) {
      baseNode.isLegal = checkFieldLegal({ fieldConfig: node, fieldList });
    }
  } 
  return baseNode;
}
function renderMethodModel({ node, paramsType, path, fieldList }) {
  const methodBtn = editorButtonsMap.btnGroup.find(btn => btn.name === node.name);
  const baseNode = {
    ...methodBtn,
    children: parseMethodParams({
      params: node.params,
      parentPath: path,
      place: methodBtn.renderType,
      fieldList
    })
  }
  
  return baseNode;
}
function renderIfModel({ node, path, fieldList }) {
  node.name = node.type;
  return renderMethodModel({ node, path, fieldList });
}
function renderCaseModel({ node, path, fieldList }) {
  const caseBtn = editorButtonsMap.btnGroup.find(btn => btn.name === 'case');
  return {
    ...caseBtn,
    children: parseCaseParams({
      parentNode: node,
      parentPath: path,
      fieldList
    })
  }
}
function renderDataTypeModel({ node, path, fieldList }) {
  const dataTypeBtn = editorButtonsMap.btnGroup.find(btn => btn.name === node.name);
  const baseNode = {
    ...dataTypeBtn
  };
  if (node.name === 'decimal') {
    baseNode.children = parseMethodParams({
      params: node.params,
      parentPath: path,
      place: baseNode.renderType,
      fieldList
    });
  }
  return baseNode;
}
/**
 case输入格式：{
  "type": "case",
  "defaultValue": { "type": "nodeList", "nodes": [ { "type": "digit", "value": "0" } ] }, 
  "params": [ { 
    "condition": { "type": "nodeList" , "nodes": [ { "fieldColumnName": "stastore_type", "fieldShowName": "驻店类型", "type": "field" }, { "name": "=", "type": "operator" }, { "type": "constant", "value": "中" } ]}, 
    "value": { "type": "nodeList", "nodes": [ { "type": "digit", "value": "1" } ] } 
  } ] 
}
case输出格式：{
  category,
  params,
  defaultValue,
  renderType: 'case',
  paramsType: 'case',
  path: '0'
  place: 'rootChildren',
  children: [
    [
      { category: 'field', renderType: 'tag', paramsType: 'field', path: '0-0-0', place: 'caseCondition', "fieldColumnName": "stastore_type", "fieldShowName": "驻店类型"}, 
      { category: 'operator', renderType: 'text', paramsType: 'operator', path: '0-0-1', place: 'caseCondition',"name": "="},{...},
      { category: 'digit', renderType: 'text', paramsType: 'digit', path: '0-0-3', place: 'caseValue', value: 1},
    ],
    [ 
      { category: 'digit', renderType: 'text', paramsType: 'digit', path: '0-1-0', place: 'caseDefaultValue', value: 0}
    ]
  ]
}
 */
function parseCaseParams({ parentNode, parentPath, fieldList }) {
  const caseParams = parentNode.params;
  const caseDefaultValue = parentNode.defaultValue;
  let defaultValueNodeList = [];
  const whenThenList = caseParams.map((whenThenArr, whenThenIndex) => {
    let conditionNodeList = [];
    let valueNodeList = [];

    if (whenThenArr.condition && whenThenArr.condition.nodes) {
      conditionNodeList = whenThenArr.condition.nodes.map((conditionNode, index) => {
        return parseNode({node: conditionNode, path: `${parentPath}-${whenThenIndex}-${index}`, place: 'caseCondition', fieldList})
      })
    }
    if (whenThenArr.value && whenThenArr.value.nodes) {
      valueNodeList = whenThenArr.value.nodes.map((valueNode, index) => {
        return parseNode({node: valueNode, path: `${parentPath}-${whenThenIndex}-${conditionNodeList.length + index}`, place: 'caseValue', fieldList })
      })
    }
    return {
      conditionNodeList,
      valueNodeList
    }
  })

  if (caseDefaultValue && caseDefaultValue.nodes) {
    defaultValueNodeList = caseDefaultValue.nodes.map((defaultValueNode, index) => {
      return parseNode({node: defaultValueNode, path: `${parentPath}-${caseParams.length}-${index}`, place: 'caseDefaultValue', fieldList})
    })
  }
  const children = [];
  whenThenList.forEach((whenThenArr) => {
    const nodeList = [];
    [].push.apply(nodeList, whenThenArr.conditionNodeList);
    [].push.apply(nodeList, whenThenArr.valueNodeList);
    children.push(nodeList);
  })
  children.push(defaultValueNodeList)

  return children;
}

function parseNodeParams({ params, parentPath, place, fieldList }) {
  return params.map((param, arrIndex) => {
    let arr = [];
    param.nodes.forEach((node, index) => {
      arr.push(parseNode({
        node,
        path: `${parentPath}-${arrIndex}-${index}`,
        place: place,
        fieldList
      }));
    })
    return arr;
  })
 }
function parseMethodParams({params, parentPath, place, fieldList}) {
  return params.map((param, arrIndex) => {
    let arr = [];
    param.nodes.forEach((node, index) => {
      arr.push(parseNode({
        node,
        path: `${parentPath}-${arrIndex}-${index}`,
        place: place,
        fieldList
      }));
    })
    return arr;
  })
}