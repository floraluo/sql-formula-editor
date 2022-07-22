<template>
  <li :class="formulaNodeCls">
    <span :class="firstPlaceTriggerCls"
          v-show="editable"
          :data-node="node.name"
          @click="$emit('moveCursorToFirst', node)"> </span>
    <component :is="nodeRenderType"
      :node="node" 
      :prevCursor="prevCursor"
      :cursor="cursor"
      :selectedNode="selectedNode"
      :hoverNode="hoverNode"
      :editable="editable"
      v-on="$listeners"/>
    <span :class="cursorCls" v-if="showCursor"></span>
  </li>
</template>
<script>
import editorButtonsMap from '@/lib/editorButtonsMap'
import FormulaTagNode from '@/components/editor/FormulaTagNode'
import FormulaTextNode from '@/components/editor/FormulaTextNode'
import FormulaLikeNode from '@/components/editor/FormulaLikeNode'
import FormulaMethodNode from '@/components/editor/FormulaMethodNode'
import FormulaCaseNode from '@/components/editor/FormulaCaseNode'
// 节点渲染类型映射组件
const nodeRenderTypeMap = {
  'fixedParams': FormulaMethodNode,
  'dynamicParams': FormulaMethodNode,
  'customParams': FormulaLikeNode,
  'case': FormulaCaseNode,
  'tag': FormulaTagNode,
  'text': FormulaTextNode,

  // 'field': FormulaTagNode,
  // 'system': FormulaTagNode,
  // 'constant': FormulaTagNode,
  // 'operator': FormulaTextNode,
  // 'digit': FormulaTextNode,
}
export default {
  name: 'FormulaNode',
  components: { 
    FormulaTagNode,
    FormulaTextNode,
    FormulaLikeNode,
    FormulaMethodNode,
    FormulaCaseNode
  },
  // inject: ['prevCursor', 'cursor', 'selectedNode', 'hoverNode'],

  props: {
    editable: {
      type: Boolean,
      default: true
    },
    node: { type: Object },
    nodeIndex: { type: Number, default: -1 },
    prevCursor: { type: Object },
    selectedNode: { type: Object },
    cursor: { type: Object },
    hoverNode: { type: Object }
  },
  computed: {
    nodeRenderType() {
      const type = nodeRenderTypeMap[this.node.renderType];
      return type;
    },

    formulaNodeCls() {
      let structBgClass = '';
      if (this.node.paramsType === 'case') {
        structBgClass = `struct-bg-${this.node.path.split('-').length % 3}`
      } 
      return [ 'li-formula-row formula-node', structBgClass,
        { 
          ['active']: this.activeClass, 
          ['selected']: this.nodeIsSelected, 
          ['bg-hover']: this.hoverNode && this.hoverNode.path === this.node.path 
        }, 
      ]
    },
    firstPlaceTriggerCls() {
      return [ 'first-place-trigger',
        { 
          ['active-cursor']: this.prevCursor.path === null && this.cursor.path === this.node.path && this.cursor.place === this.node.place 
        }
      ]
    },
    cursorCls() {
      return [ 'cursor-placeholder', 
        {
          ['after-struct-cursor']: this.node.renderType === 'case',
        }
      ]
    },
    showCursor() {
      if (this.editable) {
        let show = this.node.path === this.prevCursor.path;
        if ( this.node.name === 'like' ) {
          show = show && this.node.children[0][0].disabled
        }
        return show;
      } else {
        return false;
      }
    },
    activeClass() {
      return this.cursor.path === `${this.node.path}-0` || this.prevCursor.path === this.node.path
    },
    nodeIsSelected() {
      return !!this.selectedNode && this.selectedNode.path === this.node.path;
    },
  },
  data() {
    return {
      ...editorButtonsMap,
      conditionTooltip: false,
      statement1Tooltip: false,
      selectedNodePath: null,
    }
  },
  methods: {
    editParams({
      node,
      paramsArrIndex,
      place
    }){
      this.$emit('editParams', {
        node,
        paramsArrIndex,
        place
      })
    },
    clickNodeName(node) {
      if (!this.nodeIsSelected) {
        // 点击一次，触发‘moveCursor’事件移动光标。点击第二次为同一个节点，增加下划线样式
        this.$emit('selectedNode', {selected: false});
        if (this.activeClass) {
          this.$emit('selectedNode', {node, selected: true})
        } 
        this.$emit('moveCursor', node);
      } else {
        this.$emit('selectedNode', {selected: false})
      }

    },
   
  },
}
</script>
<style lang="less" >
.struct-bg-0{
  background-color: rgb(249, 255, 245);
}
.struct-bg-1{
  background-color: rgb(245, 245, 255);
}
.li-formula-row{
  position: relative;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  list-style: none;
  white-space: nowrap;
  cursor: default;
  // vertical-align: text-top;
  &.active{
    color: rgb(52, 56, 255);
  }
  &.selected{
    border-bottom: 1px solid rgb(52, 56, 255);
  }
  ul{
    padding-left: 0;
    position: relative;
    white-space: nowrap;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    &.inline-block{
      display: inline-block;
    }
    &::after{
    content: '';
    position: absolute;
    height: 100%;
  }
  }
}
.formula-node{

  .cursor-placeholder{
    margin-right: 5px;
    &::after{
      content: '|';
      color: #f00; 
      opacity: 1;
      font-weight: bold;
      animation: cursorBlink 1s linear infinite;
      -webkit-animation: cursorBlink 1s linear infinite;
    }
  }
  .default-symbol, .case-statement{
    color: rgb(185, 185, 185);
    font-weight: bold;
    // vertical-align: super;
    // padding-right: 5px;
    &.then{
      padding-left: 5px;
    }
  }
  .delete-when-then{
    height: 20px;
    vertical-align: text-bottom;
    span{
      line-height: 1;
    }
  }
  .case-btn-group{
    margin-top: 5px;
    margin-bottom: 5px;
    padding-right: 10px;
    display: flex;
    justify-content: center;
    > button + button{
      margin-left: 5px;
    }
  }
  .constant-input{
    width: 100px;
  }
  .edit-area-field-tag{
    cursor: default;
    margin-top: -3px;
  
  }
  .ul-struct {
    > li{
      padding-bottom: 5px;
    }
    ul + ul{
      margin-top: 3px;
    }
  }
  .after-struct-cursor{
    position: absolute;
    top:1px;
    right: -10px;
  }
  .active-cursor{
    &::after {
      content: '|';
      color: #f00;
      opacity: 1;
      margin-left: 10px;
      font-weight: bold;
      animation: cursorBlink 1s linear infinite;
      -webkit-animation: cursorBlink 1s linear infinite;
    }
  }
  .first-place-trigger{
    padding-left: 3px;
    padding-right: 3px;
    margin-left: -6px;
    position: absolute;
    height: 22px;
    cursor: text;
    &:hover{
      background-color: #000;
    }
    &.active-cursor{
      &::after{
        margin-left: 0;
      }
      &:hover{
        background-color: rgba(0,0,0,0);
      }
    }
  }
}
@keyframes cursorBlink {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
}
@-webkit-keyframes cursorBlink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
    // from {
    //   opacity: 0;
    // }
    // to {
    //   opacity: 1;
    // }
}
</style>