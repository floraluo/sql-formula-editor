import { nodeChildrenMap } from "./nodeMaps";
// import { deepCopy } from '@/lib/util.js'
import { cloneDeep } from "lodash";

interface INode {
  [name: string]: any;
  nodeIndex: number;
  layerIndex: number;
  verticalIndex: number;
  parentNode?: INode;
  children?: INode[] | INode[][];
  cloneNode: () => INode | undefined;
  initNode: ({
    opt,
    parentNode,
    autoReplace,
    fieldList,
  }: {
    opt: any;
    parentNode: INode;
    autoReplace?: boolean;
    fieldList?: any[];
  }) => INode;
  updateChildNodeIndex: ({
    layerIndex,
    startIndex,
  }: {
    layerIndex: number;
    startIndex: number;
  }) => void;
  reset: (rootNode: any) => void;
  patchInsertNode: ({
    nodeList,
    index,
    layerIndex,
    cursor,
    fieldListAvailable,
  }: {
    nodeList: INode[];
    index: number;
    layerIndex: number;
    cursor: any;
    fieldListAvailable: any[];
  }) => void;
  getNodeList: (layerIndex: number) => any[];
  insertNode: ({
    node,
    index,
    layerIndex,
    cursor,
    autoReplace,
    fieldListAvailable,
  }: {
    node: any;
    index: number;
    layerIndex: number;
    cursor: any;
    autoReplace?: boolean;
    fieldListAvailable?: any[];
  }) => void;
  deleteNode: (index: number, layerIndex: number) => void;
  insertLayer: ({
    layerIndex,
    copy,
  }: {
    layerIndex: number;
    copy: boolean;
  }) => void;
  deleteLayer: (layerIndex: number) => void;
  updateNodeLayerIndex: (layerIndex: number) => void;
  autoReplaceSelfField: (fieldListAvailable: any[]) => void;
}
interface INodeOptKeyObj {
  [key: string]: number | string | [];
}
type HasChildrenNodeType = keyof typeof nodeChildrenMap;
/**
 * opt:  节点可扩展任意属性，比如传参属性，渲染/操作节点属性
 *
 */
class Node implements INode {
  parentNode?: INode;
  nodeIndex: number;
  layerIndex: number;
  verticalIndex: number;
  [key: string]: any;
  // opt: object;
  constructor({ opt, parentNode }: { opt: INodeOptKeyObj; parentNode?: INode }) {
    // this.opt = opt;
    Object.keys(opt).forEach((key) => {
      // if (typeof key === 'string') {
      this[key] = opt[key];
      // }
    });
    this.nodeIndex = <number>opt.nodeIndex;
    this.layerIndex = <number>opt.layerIndex;
    this.verticalIndex = <number>opt.verticalIndex;
    this.parentNode = parentNode;
    // if (parentNode) {
    //   const nodePathArray = [this.nodeIndex, this.layerIndex]
    //   if (parentNode.pathArray) {
    //     console.log('parentNode.pathArray :>> ', parentNode.pathArray);
    //     const parentPathArray = JSON.parse(JSON.stringify(parentNode.pathArray));
    //     parentPathArray[parentPathArray.length] = nodePathArray
    //     this.pathArray = parentPathArray
    //   } else {
    //     this.pathArray = nodePathArray
    //   }
    //   console.log('this.pathArray:>> ', this.pathArray);
    //   this.pathStr = this.pathArray.toString();
    //   console.log('this.pathStr:>> ', this.pathStr);
    // }
    if (!opt.children) {
      const getNodeChildren =
        nodeChildrenMap[<HasChildrenNodeType>opt.renderType];
      if (getNodeChildren) {
        this.children = getNodeChildren(this);
      }
    }
    Object.defineProperty(this, "path", {
      get() {
        if (this.parentNode) {
          const parentNodePath = this.parentNode && this.parentNode.path;
          const pathArr = [];
          parentNodePath !== undefined && pathArr.push(parentNodePath);
          this.layerIndex !== undefined && pathArr.push(this.layerIndex);
          pathArr.push(this.nodeIndex);
          return pathArr.join("-");
        } else {
          return undefined;
        }
      },
      set() {},
    });
  }
  //克隆节点
  cloneNode(): INode | undefined {
    if (this.constructor === Node) {
      const copyNode = cloneDeep(this);
      delete copyNode.parentNode;
      return this.initNode({
        opt: copyNode,
        parentNode: this.parentNode,
      });
    }
  }

  //初始化一个新节点
  initNode({
    opt,
    parentNode,
    autoReplace = false,
    fieldList,
  }: {
    opt: INodeOptKeyObj;
    parentNode?: INode;
    autoReplace?: boolean;
    fieldList?: any[];
  }): INode {
    const node: INode = new Node({
      opt,
      parentNode,
    });
    if (autoReplace && node.category === "field") {
      node.autoReplaceSelfField(fieldList!);
    }
    if (opt.children) {
      node.children = [];
      _initChildrenOfCopiedNode({
        parentNode: node,
        children: <INode[] | INode[][]>opt.children,
        autoReplace,
        fieldList,
      });
    }
    return node;
  }
  /** 更新节点索引
   * layerIndex: 需要更新的层索引
   * startIndex: 开始更新节点的索引
   */
  updateChildNodeIndex({
    layerIndex,
    startIndex,
  }: {
    layerIndex: number;
    startIndex: number;
  }) {
    const childList = this.getNodeList(layerIndex);
    childList.forEach((childNode, index) => {
      if (index >= startIndex) {
        childNode.nodeIndex = index;
      }
    });
  }
  //重置根节点（撤销，恢复操作）
  reset(rootNodeSnapShot: any) {
    if (this.renderType == "root") {
      const rootChildNodeList = rootNodeSnapShot.children.map(
        (childNode: any, index: number) => {
          return this.initNode({
            opt: {
              ...childNode,
              place: "rootChildren",
              nodeIndex: index,
            },
            parentNode: this,
          });
        }
      );
      this.children.push(...rootChildNodeList);
    }
  }
  //批量插入节点（粘贴整个公式）
  patchInsertNode({
    nodeList,
    index,
    layerIndex,
    cursor,
    fieldListAvailable,
  }: {
    nodeList: INode[];
    index: number;
    layerIndex: number;
    cursor: any;
    fieldListAvailable: any[];
  }) {
    const insertedNodeList: INode[] = nodeList.map((node) => {
      if (!(node instanceof Node)) {
        if (!cursor) {
          throw new Error("实例化Node，缺少cursor");
        }

        const insertedNode = this.initNode({
          opt: {
            ...(<INodeOptKeyObj>node),
            place: cursor.place,
            nodeIndex: cursor.index,
            layerIndex: cursor.layerIndex,
          },
          parentNode: this,
          autoReplace: true,
          fieldList: fieldListAvailable,
        });
        if (node.category === "field") {
          insertedNode.autoReplaceSelfField(fieldListAvailable);
        }
        return insertedNode;
      } else {
        return node;
      }
    });
    const childList = this.getNodeList(layerIndex);
    childList.splice(index, 0, ...insertedNodeList);
    // 更新被插入节点所有子节点索引
    this.updateChildNodeIndex({ layerIndex, startIndex: index });
  }
  //根部子节点列表是一维数组。其他方法节点，case节点，是二维数组
  getNodeList(layerIndex: number): any[] {
    if (layerIndex !== undefined) {
      return this.children[layerIndex];
    } else {
      return this.children;
    }
  }
  // 插入节点
  insertNode({
    node,
    index,
    layerIndex,
    cursor,
    autoReplace = false,
    fieldListAvailable,
  }: {
    node: any;
    index: number;
    layerIndex: number;
    cursor: any;
    autoReplace?: boolean;
    fieldListAvailable?: any[];
  }) {
    let insertedNode = node;
    if (!(node instanceof Node)) {
      if (!cursor) {
        console.error("实例化Node，缺少cursor");
        return;
      }
      insertedNode = this.initNode({
        opt: {
          ...node,
          place: cursor.place,
          nodeIndex: cursor.index,
          layerIndex: cursor.layerIndex,
          verticalIndex: cursor.verticalIndex,
        },
        parentNode: this,
        autoReplace,
        fieldList: fieldListAvailable,
      });
      if (autoReplace && node.category === "field") {
        insertedNode.autoReplaceSelfField(fieldListAvailable);
      }
    }
    const childList = this.getNodeList(layerIndex);
    childList.splice(index, 0, insertedNode);
    // 更新被插入节点所有子节点索引
    this.updateChildNodeIndex({ layerIndex, startIndex: index });
  }
  autoReplaceSelfField(fieldListAvailable: any[]) {
    const type = this.type || this.paramsType;
    if (type === "self-field") {
      const selfFieldIsLegal = fieldListAvailable!
        .filter((field) => field.currentDS)
        .some((field) => {
          const { fieldShowName } = field;
          if (fieldShowName === this.fieldShowName) {
            this.fieldColumnName = field.fieldColumnName;
            return true;
          }
        });
      this.isLegal = selfFieldIsLegal;
    } else if (type === "field") {
      const isDataSourceField = !!this.dataSourceId;
      const isDataSetField = !!this.dataSetId;
      let fieldIsLegal;
      if (isDataSourceField) {
        fieldIsLegal = fieldListAvailable!
          .filter((field) => !field.currentDS)
          .some((field) => {
            if (
              field.dataSourceId === this.dataSourceId &&
              field.fieldColumnName === this.fieldColumnName &&
              (field.fieldDisplayName === this.fieldShowName ||
                field.fieldDisplayName === this.fieldDisplayName)
            ) {
              return true;
            }
          });
      } else if (isDataSetField) {
        fieldIsLegal = fieldListAvailable!
          .filter((field) => !field.currentDS)
          .some((field) => {
            if (
              field.dataSetId === this.dataSetId &&
              field.fieldColumnName === this.fieldColumnName &&
              (field.fieldDisplayName === this.fieldShowName ||
                field.fieldDisplayName === this.fieldDisplayName)
            ) {
              return true;
            }
          });
      }
      this.isLegal = fieldIsLegal;
    } else {
      this.isLegal = false;
    }
  }
  deleteNode(index: number, layerIndex: number) {
    const childList = this.getNodeList(layerIndex);
    childList.splice(index, 1);
    //更新被删除节点的所有子节点索引
    this.updateChildNodeIndex({ layerIndex, startIndex: index });
  }
  // 插入case whenThen层
  insertLayer({
    layerIndex,
    copy = false,
  }: {
    layerIndex: number;
    copy: boolean;
  }) {
    if (this.children) {
      const increaseWhenThen: INode[] = [];
      if (layerIndex > 0 && copy) {
        const sourceWhenThen: INode[] = this.children[layerIndex - 1];
        sourceWhenThen.forEach((node) => {
          increaseWhenThen.push(<INode>node.cloneNode());
        });
      }
      this.children.splice(layerIndex, 0, increaseWhenThen);
      this.updateNodeLayerIndex(layerIndex);
    }
  }

  // 删除方法、case层
  deleteLayer(layerIndex: number) {
    this.children.splice(layerIndex, 1);
    this.updateNodeLayerIndex(layerIndex);
  }
  // 更新节点的层索引
  updateNodeLayerIndex(layerIndex: number) {
    this.children.forEach((childList: INode[], index: number) => {
      if (index >= layerIndex) {
        childList.forEach((childNode) => {
          childNode.layerIndex = index;
        });
        // this._updateCaseNodesPathAfterOperateWhenThen(whenThenArr, caseNode.path.split('-').length, 'delete');
      }
    });
  }

  //获取节点json字符串格式
  get getString() {
    return JSON.stringify(this, (key, value) => {
      if (key === "parentNode" && value instanceof Node) {
        return undefined;
      }

      return value;
    });
  }
}

export default Node;

function _initChildrenOfCopiedNode({
  parentNode,
  children,
  autoReplace,
  fieldList,
  layerIndex,
}: {
  parentNode: INode;
  children: INode[] | INode[][];
  autoReplace: boolean;
  fieldList?: any[];
  layerIndex?: number;
}) {
  children.forEach((childNode: INode | INode[], index: number) => {
    if (Array.isArray(childNode)) {
      (<INode[][]>parentNode.children).push([]);
      _initChildrenOfCopiedNode({
        parentNode,
        children: childNode,
        autoReplace,
        fieldList,
        layerIndex: index,
      });
    } else {
      const newNode: INode = new Node({
        opt: {
          ...(<INodeOptKeyObj>childNode),
          place: parentNode.name === "case" ? childNode.place : parentNode.name,
          nodeIndex: index,
          layerIndex: <number>layerIndex,
        },
        parentNode,
      });
      if (autoReplace && newNode.category === "field") {
        newNode.autoReplaceSelfField(fieldList!);
      }
      if (childNode.children) {
        newNode.children = [];
        _initChildrenOfCopiedNode({
          parentNode: newNode,
          children: childNode.children,
          autoReplace,
          fieldList,
        });
      }
      (<INode[]>parentNode.children)[<number>layerIndex].push(newNode);
    }
  });
}
