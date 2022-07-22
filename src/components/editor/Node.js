function Node(opt) {
  // Object.keys(opt).forEach(key => {
  //   this[key] = opt[key];
  // })
  this.place = opt.place;
  this.parentNode = opt.parentNode;
  this.levelIndex = opt.levelIndex;
  this.nodeIndex = opt.nodeIndex;
}
Node.prototype = {
  constructor: Node,
  insertChildNode() { },
  deleteChildNode() { },
  getPath() {
    return `${this.parentNode.path}-${this.levelIndex}-${this.nodeIndex}`
  },
  _stepBack() {
    this.nodeIndex--;
  },
  _stepForward() { 
    this.nodeIndex++;
  },

}