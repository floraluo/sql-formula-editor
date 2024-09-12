# Node 说明

## 属性一览

Node分了参数类型（paramsType）、类别（category）、渲染类型（renderType）
属性名 | 可取值
--- | ---
paramsType | [digit, operator, fix-params-method,dynamic-params-method, if, case, field,self-field, constant, system, nodeList, data-type]
category | [digit, operator, method, if, case, field, constant, dataType]
renderType |  [text, fixedParams, dynamicParams, customParams, case, tag]

- paramsType: 传参类型。请求接口提交参数时，各个节点的类型。
- category: 类别。简化paramsType中的类型，方便简化代码的逻辑
- renderType: 渲染类型。简化相同渲染类型的节点代码逻辑

### category简化对照表

category | paramsType
--- | ---
digit | digit
operator | operator
if | if
case | case
method | fix-params-method, dynamic-params-method
field | field, self-field
constant | system, constant
dataType | data-type(不包括decimal类型)

### renderType简化对照表

renderType | paramsType
--- | ---
text | digit, operator, data-type(bigint, string, double)
fixedParams | fix-params-method, data-type(decimal)
dynamicParams | dynamic-params-method
customParams | (like节点input渲染方式已经废弃)
case | case
tag | system, constant, field, self-field

- nodeIndex
  - 节点索引
- layerIndex
  - 层级索引：方法，if, case节点中有层级索引。根结点中等于undefined
- place
  - 所在位置。更详细信息可参考[Cursor.md](./Cursor.md)
- parentNode
  - 父节点对象
- 其他属性，可参考[editorButtonsMap.js](../../../lib/editorButtonsMap.js)中每个按钮的配置信息。按钮的配置信息都加在了node节点上。

## 方法一览

- initNode
- updateChildNodeIndex 
  - 更新子节点索引
- reset
  - 重置根节点（撤销，恢复操作）
- patchInsertNode
  - 批量插入节点（粘贴整个公式）
- getNodeList
  - 根部子节点列表是一维数组。其他方法节点，case节点，是二维数组
- insertNode
  - 插入节点
- deleteNode
  - deleteNode(index, layerIndex) {
- insertLayer
  - 插入case whenThen层
- deleteLayer
  - 删除方法、case层
- updateNodeLayerIndex
  - 更新节点的层索引

