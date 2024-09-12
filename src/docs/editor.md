# 编辑器说明

## 资料

- [公式模型](https://km.sankuai.com/page/1218259214)

## 规则

- 删除`case`节点when then  组
  - 光标在删除组上：
    1. 删除的是第一组，移动光标到`case`节点后
    2. 否则移动光标到上一组then最后
  - 光标在删除组后：
    1. 更新光标路径，继续在对应节点上不动；
- 删除节点：
  - 删除首节点：
    1. --cursor.index 光标前移
    2. cursor.initPrev() 光标prevXXX全部置null
  - 删除其他节点：
    1. --cursor.index 光标前移
    2. cursor.initPrev(deletedNode.previousSibling) 光标prevXXX属性记录被删除节点前一个兄弟节点的相关属性
- 新增case节点 || 新增case条件
  - cursor移到新增的首个when节点
  - prevCursor初始化
- 新增method
  - cursor移到第一个参数首节点
  - prevCursor初始化
- 新增其他节点
  - cursor移动新增节点后
  - prevCursor保存新增节点的path、type、place

## 语句块中节点操作流程

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
