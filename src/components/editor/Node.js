import { nodeChildrenMap } from './nodeMaps'

function Node({ opt, parentNode }) {
//   place
  // let nodeIndex;
  // let layerIndex;
  // console.log('parentNode :>> ', parentNode);
  this.parentNode = parentNode;

  this.seat = {
    nodeIndex: undefined,
    layerIndex: undefined
  }
  // const watchedProperty = ['nodeIndex', 'layerIndex'];
  // watchedProperty.forEach(property => {
  //   Object.defineProperty(this, property, {
  //     get() {
  //       return this.seat[property]
  //     },
  //     set(newValue) {
  //       this.seat[property] = newValue;
  //       if (this.parentNode.name === 'root') {
  //         this.path = `${this.nodeIndex}`;
  //       } else {
  //         this.path = `${this.parentNode.path}-${this.layerIndex}-${this.nodeIndex}`;
  //       }
  //       this.updateChildPath();
  //     },
  //     enumerable: true,
  //     configurable: true
  //   })
  // })
  Object.keys(opt).forEach(key => {
    this[key] = opt[key];
  })
  if (!opt.children) {
    const getNodeChildren = nodeChildrenMap[opt.renderType];
    this.children = getNodeChildren ? getNodeChildren(this): undefined;
  }
  Object.defineProperty(this, 'path', {
    get() {
      if (this.parentNode) {
        const parentNodePath = this.parentNode && this.parentNode.path;
        const pathArr = [];
        parentNodePath !== undefined && pathArr.push(parentNodePath);
        this.layerIndex !== undefined && pathArr.push(this.layerIndex);
        pathArr.push(this.nodeIndex);
        return pathArr.join('-');
      } else {
        return undefined;
      }

    },
    set() { 
      console.log('set Node Path :>> ', this.path);
    }
  })
}

Node.prototype = {
  constructor: Node,
  moveBack() { 
    this.nodeIndex--;
  },
  moveForward() { 
    this.nodeIndex++;
  },
  updateChildPath() { 
    if (this.children && this.children.length) {
      this.children.forEach((childNodeList, layerIndex) => {
        childNodeList.forEach((child, index) => {
          // child.
        })
      })
    }
  },

  initNode() { 

  },
  insertNode() { 
    
  },
  deleteChildNode() { },
  getPath() {
    return `${this.parentNode.path}-${this.levelIndex}-${this.nodeIndex}`
  },
  

}
export default Node;