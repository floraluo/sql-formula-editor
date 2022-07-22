
export default function(nodeList) {
  return formatNodeList(nodeList);
}

function formatNodeList(nodeList){
  return nodeList.map(node => {
    return formatNode(node);
  })
}
function formatNode(node) {
  // 配置所有参数类型返回的数据模型
  // 返回数据模型方
  // 简单模型根据返回值不同key分类（比如：operator返回{ type, name }，digit返回{ type, value }）
  // 复杂模型按类别定义方法，
  // params type doc: https://km.sankuai.com/page/1218259214
  const returnParamsTypeMap = {
    'fix-params-method': returnMethodCategoryParam,
    'dynamic-params-method': returnMethodCategoryParam,
    'operator': returnNameParam,
    'if': returnIfNodeParam,
    'case': returnCaseNodeParam,
    'digit': returnValueParam,
    'constant': returnValueParam,
    'field': returnFieldCategoryParam,
    'self-field': returnFieldCategoryParam,
    'system': returnValueParam,
    'data-type': returnDataTypeParams
  }
  const { paramsType } = node;
  return returnParamsTypeMap[paramsType](node);
}

function returnNameParam(node) {
  return {
    type: node.paramsType,
    name: node.name
  }
}
function returnValueParam(node) {
  return {
    type: node.paramsType,
    value: node.value
  }
}
function returnFieldCategoryParam(node) {
  // TODO: 确定fieldShowName接口返回值是否依赖传参
  return {
    type: node.paramsType,
    dataSetId: node.dataSetId,
    dataSetAlias: node.dataSetAlias,
    dataSourceId: node.dataSourceId,
    fieldColumnName: node.fieldColumnName,
    fieldShowName: node.fieldDisplayName || node.fieldShowName
  }
}
function returnMethodCategoryParam(node) {
  return {
    type: node.paramsType,
    name: node.name,
    params: formatChildren(node.children)
  }
}
function returnIfNodeParam(node) {
  // return Object.assign( { type: node.paramsType }, { params: formatChildren(node.children) })
  return {
    type: node.paramsType,
    params: formatChildren(node.children)
  }
}
function returnCaseNodeParam(node) {
  // return Object.assign( { type: node.paramsType}, { 
  //   params: formatCaseChildren(node.children),
  //   defaultValue: formatCaseChildren(node.children, 'caseDefaultValue')
  // })
  return {
    type: node.paramsType,
    params: formatCaseChildren(node.children),
    defaultValue: formatCaseChildren(node.children, 'caseDefaultValue')
  }
}
function returnDataTypeParams(node) {
  const dataTypeCategoryMap = {
    'dataType': returnNameParam,
    'method': returnMethodCategoryParam
  }
  const dataTypeParam = dataTypeCategoryMap[node.category](node);
  return dataTypeParam;
}


function formatChildren(children) {
  return children.map(nodeList => {
    return {
      type: 'nodeList',
      nodes: formatNodeList(nodeList)
    }
  })
}
function formatCaseChildren(children, type) {
  if (type === 'caseDefaultValue') {
    const defaultValueNodeList = children.slice(-1)[0];
    return {
      type: 'nodeList',
      nodes: defaultValueNodeList.map(node => {
        return formatNode(node);
      })
    }
  } else {
    const caseParams = [];
    children.slice(0, -1).forEach((whenThenArr, index) => {
      const conditionNodeList = whenThenArr.filter(node => node.place === 'caseCondition');
      const valueNodeList = whenThenArr.filter(node => node.place === 'caseValue');
      caseParams.push({
        condition: {
          type: 'nodeList',
          nodes: conditionNodeList.map(conditionNode => {
            return formatNode(conditionNode);
          })
        },
        value: {
          type: 'nodeList',
          nodes: valueNodeList.map(valueNode => {
            return formatNode(valueNode);
          })
        }
      })
    })
    return caseParams;
  }
  
}