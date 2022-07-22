import checkFieldLegal from "./checkFieldLegal";
export default function (formulaRenderModel, fieldList) { 
  walkNodeList(formulaRenderModel, fieldList);
  return formulaRenderModel;
}

function walkNodeList(nodeList, fieldList) { 
  nodeList.forEach(node => {
    const type = node.paramsType || node.type; //函数、if、case有解析成渲染模型，paramsType对应于字段的type，属于同后端交互的类型
    if (type === 'field') {
      node.isLegal = checkFieldLegal({ fieldConfig: node, fieldList });
    } else if (type === 'fix-params-method' || type === 'dynamic-params-method' || type === 'case' || type === 'if') {
      node.children.forEach(child => {
        walkNodeList(child, fieldList);
      })
      console.log('node.children :>> ', node.children);
    }
  })
}