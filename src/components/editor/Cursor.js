import { deepCopy } from '@/lib/util'
export default function Cursor(parentNode) {
  this.index = parentNode.children.length;
  this.layerIndex = undefined;
  this.verticalIndex = 0;
  this.place = 'rootChildren';
  this.parentNode = parentNode;

  this.prevCategory = null;
  this.prevPath = null;
  this.prevPlace = null;

  this.rootNode = parentNode;
  this.snapshots = {
    pointer: 0,
    /** 存入pool的数据对象
     * rootNode：根结点
     * cursor: {
     *  ...deepCopy(cursor),
     *  path: this.cursor.path
     * }
     */
    pool: new Map() 
  };
  this.disabled = false; // 编辑公式中常量时，需禁用cursor。常量编辑框失焦时，且常量不为空，取消禁用cursor
  Object.defineProperty(this, 'path', {
    get() {
      const parentNodePath = this.parentNode && this.parentNode.path;
      const pathArr = [];
      parentNodePath !== undefined && pathArr.push(parentNodePath);
      this.layerIndex !== undefined && pathArr.push(this.layerIndex);
      pathArr.push(this.index);

      return pathArr.join('-');
    },
    set(newPath) {
      console.log('cursor newPath :>> ', newPath);
      console.log('this.cursor.path :>> ', this.path);
    }
  })
}
Cursor.prototype = {
  constructor: Cursor,
  init() { 
    // console.log('init cursot rootnode:>> ', this.rootNode);
    this.initPrev();
    this.index = 0;
    this.verticalIndex = 0;
    this.layerIndex = undefined;
    this.place = 'rootChildren';
    this.parentNode = this.rootNode;
    this.disabled = false; // 编辑公式中常量时，需禁用cursor。常量编辑框失焦时，且常量不为空，取消禁用cursor
  },
  initPrev(node) {
    //type主要用于前一个节点是数字用于合并
    if (node) {
      this.prevCategory = node.category;
      this.prevPath = node.path;
      this.prevPlace = node.place;
    } else {
      this.prevCategory = null;
      this.prevPath = null;
      this.prevPlace = null;
    }
  },

  getBeforeCursorNode() { 
    const childList = this.getSameLayerNodeList();
    return this.index > 0 ? childList[this.index - 1] : null;
  },
  getNodesAfterTheCursor() { 
    return this.getSameLayerNodeList().slice(this.index);
  },
  getSameLayerNodeList() { 
    if (this.layerIndex !== undefined) {
      return this.parentNode.children[this.layerIndex]
    } else {
      return this.parentNode.children;
    }
  },
  patchInsertNodeOfPaste(nodeList, fieldListAvailable) { 
    this.parentNode.patchInsertNode({
      nodeList,
      index: this.index,
      layerIndex: this.layerIndex,
      cursor: this,
      fieldListAvailable
    })
    this.updateAfterPaste(this.parentNode.children.slice(-1)[0]);
    this.pushSnapShot(this.rootNode);
  },
  insertNodeOfPaste(node, fieldListAvailable) { 
    this.parentNode.insertNode({
      node,
      index: this.index,
      layerIndex: this.layerIndex,
      cursor: this,
      fieldListAvailable,
      autoReplace: true
    })
    this.updateAfterPaste(node);
    this.pushSnapShot(this.rootNode);
  },
  insertNode(newNode) {
    // this.getSameLayerNodeList().splice(this.index, 0, newNode);
    this.parentNode.insertNode({
      node: newNode,
      index: this.index,
      layerIndex: this.layerIndex,
      verticalIndex: this.verticalIndex,
      autoReplace: true
    })
    // this.parentNode.updateChildNodeIndex({ layerIndex: this.layerIndex, startIndex: this.index })
    // this.pushSnapShot({
    //   cursor: deepCopy(this),
    //   rootNode: deepCopy(this.rootNode)
    // })
    this.updateAfterInsertNode(newNode);
    this.pushSnapShot(this.rootNode);
  },
  //保存快照
  pushSnapShot(node) {
    this.snapshots.pool.set(this.snapshots.pointer++, {
      rootNode: deepCopy(this.rootNode),
      cursor: { ...deepCopy(this), path: this.path }
    })
    let pointer = this.snapshots.pointer;
    while (this.snapshots.pool.get(pointer)) {
      this.snapshots.pool.delete(pointer);
      pointer++;
    }
  },
  reset(cursor) { 
    // 保存快照时，提取了path保存
    const { index, layerIndex, place, prevCategory, prevPath, prevPlace, path } = cursor;
    this.index = index;
    this.layerIndex = layerIndex;
    this.place = place;

    this.prevCategory = prevCategory;
    this.prevPath = prevPath;
    this.prevPlace = prevPlace;

    this.parentNode = this.getParentNodeByPath(path);
  },
  
  getParentNodeByPath(path) { 
    const pathArr = path.split('-');
    pathArr.pop();

    let parentNode = this.rootNode;
    let node = this.rootNode;
    pathArr.forEach((pathIndex) => {
      node = node.children && node.children[pathIndex] || node[pathIndex];
      if (!Array.isArray(node)) {
        parentNode = node;
      }
    });
    return parentNode;
  },
  updateAfterPaste(pasteNode) { 
    this.initPrev(pasteNode);
    this.index = pasteNode.nodeIndex + 1;
  },
  // 插入节点后更新光标
  updateAfterInsertNode(insertedNode) {
    const { renderType } = insertedNode;
    if (renderType === 'text' || renderType === 'tag') {
      this.initPrev(insertedNode);
      ++this.index;
    } else if (renderType === 'fixedParams' || renderType === 'dynamicParams'){
      this.initPrev();
      this.layerIndex = 0;
      this.index = 0;
      ++this.verticalIndex
      this.parentNode = insertedNode;
      this.place = renderType;
    } else if (renderType === 'case'){
      this.initPrev();
      this.layerIndex = 0;
      this.index = 0;
      ++this.verticalIndex
      this.parentNode = insertedNode;
      this.place = 'caseCondition';
    }
  },
  // 删除节点后更新光标
  updateAfterDeleteNode() { 
    --this.index;
    if (this.parentNode.category === 'case' && this.place === 'caseValue') {
      const valueNodeList = this.parentNode.children[this.layerIndex].filter(childNode => childNode.place === 'caseValue');
      if (valueNodeList.length === 0) {
        this.initPrev();
      }
    } else if (this.index === 0) {
      this.initPrev();
    } else {
      this.initPrev(this.getBeforeCursorNode())
    }
  },
  // 删除case节点的when then层后更新光标
  updateAfterDeleteCaseWhenThen(caseNode, deletedLayerIndex) {
    if (this.layerIndex === deletedLayerIndex) {
      // 删除光标所在层
      if (deletedLayerIndex === 0) {
        // 删除了首行，移动光标到case节点后
        this.initPrev(caseNode);
        this.layerIndex = caseNode.layerIndex;
        this.index = caseNode.nodeIndex + 1;
        this.parentNode = caseNode.parentNode;
        this.place = caseNode.place;
      } else {
        // 光标所在层非首行，光标移动到上一层【公式】节点后
        const prevWhenThenArr = caseNode.children[deletedLayerIndex - 1];
        const conditionNodeList = prevWhenThenArr.filter(node => node.place === 'caseCondition');
        const valueNodeList = prevWhenThenArr.filter(node => node.place === 'caseValue');
        if (valueNodeList.length === 0) {
          // 没有公式节点
          this.initPrev();
          this.layerIndex = deletedLayerIndex - 1;
          this.index = conditionNodeList.length
          this.place = 'caseValue';
        } else {
          // 有公式节点
          const lastValueNode = valueNodeList.slice(-1)[0];
          this.initPrev(lastValueNode);
          this.layerIndex = lastValueNode.layerIndex;
          this.index = lastValueNode.nodeIndex + 1;
          this.parentNode = lastValueNode.parentNode;
          this.place = lastValueNode.place;
        }
      } 
    } else if (deletedLayerIndex < this.layerIndex) {
      //删除光标上面的层
      if (this.prevPath) {
        const prevCursorArrIndex = this.prevPath.slice(-3, -2);
        this.prevPath = `${caseNode.path}-${prevCursorArrIndex - 1}-${this.prevPath.slice(-1)}`;
      }
      this.layerIndex--;
    }
  },
  // 插入case节点的when then层后更新光标
  updateAfterInsertCaseWhenThen(caseNode, insertedLayerIndex) {
    this.initPrev();
    this.layerIndex = insertedLayerIndex;
    this.index = 0;
    this.parentNode = caseNode;
    this.place = 'caseCondition';
  },
}
