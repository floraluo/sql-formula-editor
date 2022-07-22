<template>
  <ul class="formula">
    <FormulaNode
      v-for="(node, index) in nodes"
      :key="index"
      :node="node"
      :nodeIndex="index"
      :prevCursor="prevCursor"
      :cursor="cursor"
      :selectedNode="selectedNode"
      :hoverNode="hoverNode"
      :editable="editable"
      v-on="$listeners"
    ></FormulaNode>
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
    prevCursor: { 
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
  provide () {
    return {
      // prevCursor: this.prevCursor,
      // cursor: this.cursor,
      // selectedNode: this.selectedNode,
      // hoverNode: this.hoverNode,
      prevCursor: (() => this.prevCursorProp)(),
      cursor: this.cursorProp,
      selectedNode: this.selectedNodeProp,
      hoverNode: this.hoverNodeProp,
    }
  },
  watch: {
    prevCursor: {
      handler (val) {
        // console.log('prevCursor val :>> ', val);
        this.prevCursorProp = val;
        // this.$emit('update:prevCursor', val)
      },
      immediate: true
    },
  },

  data() {
    return {
      prevCursorProp: this.prevCursor,
      cursorProp: this.cursor,
      selectedNodeProp: this.selectedNode,
      hoverNodeProp: this.hoverNode,
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
</style>