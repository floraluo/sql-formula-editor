export default function ({ fieldConfig, fieldList }) {
  // console.log('field, fieldList :>> ', field, fieldList);
  // const { fieldConfig } = field;
  // const { type: configType } = fieldConfig;
  const type = fieldConfig.paramsType || fieldConfig.type; //节点未解析时，接口返回的key是type

  if (type === 'field') {
    return walk(fieldConfig, fieldList);
  } else if (type === 'nodeList') {
    return walkNodeList(fieldConfig.nodes, fieldList);
  } else if (type === 'row-number') { 
    return !fieldConfig.groupFields.some(item => {
      // groupFields 中任何一个字段不存在fieldLst中，则结束后序字段的遍历；walk返回false时，即不存在；
      return !walk(item, fieldList);
    }) && !fieldConfig.sortFields.some(item => {
      // sortFields 中任何一个字段不存在fieldLst中，则结束后序字段的遍历；walk返回false时，即不存在；
      return !walk(item, fieldList);
    })
  }
}
// walk方法查找配置字段是否在fieldList中；false: 不存在；true: 存在；（非法异常返回false）
function walk(fieldConfig, fieldList) { 
  // const { type: configType } = fieldConfig;
  const type = fieldConfig.paramsType || fieldConfig.type; //节点未解析时，接口返回的key是type

  if (type === 'field') {
    return fieldList.some(item => {
      // fieldList中查找到配置字段结束遍历；
      if (fieldConfig.dataSourceId) {
        return item.dataSourceId === fieldConfig.dataSourceId && item.fieldColumnName === fieldConfig.fieldColumnName;
      } else if (fieldConfig.dataSetId) {
        return item.dataSetAlias === fieldConfig.dataSetAlias && item.dataSetId === fieldConfig.dataSetId && item.fieldColumnName === fieldConfig.fieldColumnName;
      } else {
        return item.fieldColumnName === fieldConfig.fieldColumnName;
      }
    })
  } else if (type === 'self-field') { 
    // FIXME: self-field walk 完善判断
    return true;
  }
}

// nodeList中有字段异常返回false；所有字段都无异常返回true；
function walkNodeList(nodeList, fieldList) { 
  return !nodeList.some(item => {
    // console.log('item :>> ', item);
    const type = item.paramsType || item.type; //节点未解析时，接口返回的key是type
    if (type === 'field') {
      return !walk(item, fieldList); //出现不存在fieldList中的异常字段，则结束上级some遍历；
    } else if (type === 'fix-params-method' || type === 'dynamic-params-method' || type === 'if') { 
      if (item.children) {
        // children字段是解析数据后，渲染的节点模型，case节点使用渲染后的节点模型方便遍历
        // case节点的参数模型{ ..., params: [], defaultValue: {} }
        // case节点渲染模型{ ..., children: []}， params和defaultValue解析到children中
        return item.children.some(child => {// 有异常字段时，结束方法其他参数位置的遍历；
          return !walkNodeList(child, fieldList);
        })
      } else {
        return item.params.some(param => {// 有异常字段时，结束方法其他参数位置的遍历；
          return !walkNodeList(param.nodes, fieldList);
        })
      }
    } else if (type === 'case') {
      if (item.children) {
        return item.children.some(child => {// 有异常字段时，结束方法其他参数位置的遍历；
          return !walkNodeList(child, fieldList);
        })
      } else {
        const caseParams = item.params;
        const caseDefaultValue = item.defaultValue;
        const children = [];
        // console.log('caseParams :>> ', caseParams);
        
        caseParams.forEach(param => {
          const whenNodes = param.condition.nodes;
          const thenNodes = param.value.nodes;
          children.push([...whenNodes, ...thenNodes])
        })
        children.push(caseDefaultValue.nodes)

        return children.some(child => {
          return !walkNodeList(child, fieldList)
        })
        

      }
    }
  })
}