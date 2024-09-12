<template>
  <ul class="formula">
    <FormulaNode
      v-for="(node, index) in nodes"
      :key="index"
      :node="node"
      :nodeIndex="index"
      :cursor="cursor"
      :selectedNode="selectedNode"
      :hoverNode="hoverNode"
      :editable="editable"
      v-on="$listeners"
    ></FormulaNode>
    <span class="cursor-placeholder" v-show="nodes.length === 0"></span>

  </ul>
</template>
<script>
import FormulaNode from '@/components/editor/FormulaNode'
export default {
  name: 'Formula',
  components: { FormulaNode },
  props: {
    // rootNode: {
    //   type: Object,
    //   required: true
    // },
    nodes: {
      type: Array,
      required: true
    },
    cursor: { 
      type: Object, 
      default: () => {
        return { 
          path: null
        }
      }
    },
    selectedNode: { type: Object, default: () => null },
    hoverNode: { type: Object, default: () => null },
    editable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
}
</script>
<style lang="less" scoped>
.formula {
  white-space: nowrap;
}
.cursor-placeholder {
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
</style>