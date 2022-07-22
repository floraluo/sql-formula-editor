# 编辑器说明

## 资料

- [公式模型](https://km.sankuai.com/page/1218259214)

## 思路

每个按钮对应一个node，node有自己的属性。点按钮，添加node到nodeTree。数据驱动页面渲染。

## 光标

prevCursor : 光标前
cursor: 插入节点处光标

### 属性

attr | desc
--- | ---
`path` | 节点路径
`place` | 节点所在位置 **rootChildren, fixedParams,dynamicParams,caseCondition,caseValue, caseDefaultValue**
`type` | 节点类型（prevCursor需要设置，主要用于判断数字节点合并）

### 规则

- 删除`case`节点when then  组
  - 光标在删除组上：
    1. 删除的是第一组，移动光标到`case`节点后
    2. 否则移动光标到上一组then最后
  - 光标在删除组后：
    1. 更新光标路径，继续在对应节点上不动；
- 【删除分支】按钮删除case节点：移动光标到case节点的位置；
- 删除节点：
  - 删除首节点：
    1. cursor.path = cursor.path = deletedNode.path;
    2. prevCursor = initPrevCursor();
  - 删除其他节点：
    1. 光标移动到删除节点位置（cursor.path = deletedNode.path）
    2. prevCursor保存删除节点前的位置（ prevCursor.path = _pathStepBack(deletedNode.path)）
- 新增case节点 || 新增case条件
  - cursor移到新增的首个when节点
  - prevCursor初始化
- 新增method
  - cursor移到第一个参数首节点
  - prevCursor初始化
- 新增自定义方法like
  - 常量输入框自动聚焦
  - cursor移到like节点后（like节点`disable=true`后光标才渲染）
  - prevCursor保存like节点的path，type，place
- 新增其他节点
  - cursor移动新增节点后
  - prevCursor保存新增节点的path、type、place


## 节点

### 节点分类

节点更具不同场景分了三种类型：
attr | desc | value
--- | --- | ---
`paramsType` | 传参类型 | digit, operator, fix-params-method, dynamic-params-method, if, case, field, self-field, constant, system, nodeList
`type` | 节点类型 | digit, operator, method, if, case, field, constant
`renderType` | 节点渲染类型 | digit, operator, fixedParams, dynamicParams, customParams, case, field, constant

### 语句块中节点操作流程

1. 增加语句块节点，默认初始化cursor.path语句块中第一个节点的位置。prevCursor.path设置为null
2. 点【删除】按钮不能删除语句块节点。若要删除语句块节点需要点击语句块对应的【删除图标】
3. 点击【删除图标】后。需要更新节点path，更新cursor；
4. 点击【删除】

    - 【删除】
      光标在同层同类型节点首位，不能执行任何删除。
      只能删除光标处同类型的节点
      删除中间节点后，updateNodePath() _updateCursorAfterDelete()

    - 【删除图标】
      case：删除图标对应的when then；cursor.path设置为前一组最后一个节点path，prevCursor.path设置为前一组倒数第二个节点path
            只有一组when then时，删除整个case语句块。cursor.path设置为删除节点path，prevCursor.path设置为删除节点前一个节点的path

5. 【edit图标】
  图标所在位置节点0个时显示
  图标处有光标隐藏
  path: 父节点path-所在组index-nodeType
  动态参数方法，点击最后一个可编辑edit图标动态增加一个
