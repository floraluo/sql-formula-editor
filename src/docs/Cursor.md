# Cursor 说明

cursor记录了索引、所在层的索引、所在位置、父节点。还有光标前一个节点的类别、路径、所在位置。
快照（snapshots）也作为属性存在cursor中。 且cursor只被实例化一次。
cursor的path采用自动监听计算方式，改变cursor时必须设置好相关的index、layerIndex、parentNode。

## 属性一览

- index
  - 索引
- layerIndex
  - 层级索引：方法，if, case节点中有层级索引。根结点中等于undefined
- place
  - 所在位置: [rootChildren, fixedParams, dynamicParams, caseCondition, caseValue,caseDefaultValue]
  - 根结点位置：rootChildren
  - 方法节点中：fixedParams, dynamicParams（取节点的renderType作为cursor的place）
  - case节点中：caseCondition, caseValue,caseDefaultValue（when：caseCondition，then：caseValue，默认值：caseDefaultValue）
- parentNode
  - 插入结构性节点（case，方法节点），parentNode等于被插入节点本身
  - 实例化时（每次弹窗打开时实例化一次），等于根节点
  - 移动时，等于同层节点的父节点
- prevCategory
  - 光标前节点的类别。主要用于插入digit类别节点可用于判断合并不新增节点
- prevPath
  - 旧版中光标在每层第一个位置时，prevPath = null。用于判断光标是否处于第一个位置。现在保留仅做代码兼容。
- prevPlace
  - 同`prevPath`仅做旧版代码兼容而保留
- rootNode
  - 根节点
- snapshots
  - 编辑快照。每一步操作都保存一份快照。包含两个属性：
    - pointer：快照指针，存一次快照，指针+1。【撤销】【恢复】通过移动指针获取快照。插入新节点时，从指针当前位置+1更新为指针最新的位置，同时清除指针后面的历史快照记录
    - pool：快照池，实际理解为一个链表。采用Map数据结构存取。
      - 存入快照池的数据模型:

        ```js
        { 
          rootNode: deepCopy(rootNode)
          cursor: { 
            ...deepCopy(cursor),
            path //path是监听属性，光标存快照时，需要获取出来一起存入
          }
        }
        ```

- disabled
  - 是否需要被禁用：
    - 编辑公式中常量时，需禁用cursor。
    - 常量编辑框失焦时，且常量不为空，取消禁用cursor
- path
  - `Object.defineProperty`监听`path`，获取时自动计算

## 方法一览

- init()
  - 清空公式，初始化整个光标属性
- initPrev(node)
  - 初始化光标prevXX属性：
    - 有传值node，以node相关属性初始化
    - 没有传旨，都初始化为null
- getBeforeCursorNode
  - 获取光标前的节点
- getNodesAfterTheCursor
  - 获取光标后的所有同层级节点列表
- getSameLayerNodeList
  - 获取光标所在层的所有节点列表
- patchInsertNodeOfPaste
  - 批量插入粘贴的节点
- insertNodeOfPaste
  - 插入粘贴的单个节点
- insertNode
  - 插入节点到光标位置
- pushSnapShot
  - 存入快照池
- reset(cursor)
  - 重置光标
    - 撤销，恢复后需重置光标到存快照时的位置
- getParentNodeByPath
  - 通过`path`获取父节点
- updateAfterPaste
  - 粘贴后更新光标
- updateAfterInsertNode
  - 插入节点后更新光标
- updateAfterDeleteNode
  - 删除节点后更新光标
- updateAfterDeleteCaseWhenThen
  - 删除case节点when then组后更新光标
- updateAfterInsertCaseWhenThen
  - 插入case节点的when then组后，更新光标
