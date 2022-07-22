<template>
  <el-tag 
    :theme="fieldTheme" 
    type="pure" 
    @click="clickNodeName(node)" 
    class="edit-area-field-tag"  
    :title="tagName" >{{tagName}}</el-tag>
</template>
<script>
export default {
  name: 'FormulaTagNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    cursor: { type: Object},
    prevCursor: { type: Object},
  },
  computed: {
    fieldTheme() {
      const { type, isLegal } = this.node;
      if ( type === 'field' ) {
        return isLegal === false ? 'red' : 'gray';
      } else {
        return 'gray';
      }
    },
    tagName() {
      const { paramsType } = this.node;
      if ( paramsType === 'field' || paramsType === 'self-field' ) {
        return this.node.fieldDisplayName || this.node.fieldShowName;
      } else if ( paramsType === 'system' ) {
        return this.node.exportChar
      } else if ( paramsType === 'constant' ) {
        return this.node.value;
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    clickNodeName(node) {
      this.$parent.clickNodeName(node);
    }
  },
}
</script>