<template>
<span>
  <el-tooltip placement="top" 
  v-if="node.editable" 
  content="常量不能为空" 
  trigger="focus" 
  :visible="node.tooltipVisible && !node.value">
    <el-input
    v-show="node.editable" 
    v-model="node.value" 
    :disabled="!node.editable" 
    v-focus 
    @blur="blurCustomParams(node, true)"
    @keyup.enter="blurCustomParams(node, false)"
    ref="input"
    size="small"
    class="constant-input"></el-input>
  </el-tooltip>
  <el-tooltip placement="top" 
  v-else
  :close-delay="0"
  :content="tagName" 
  :disabled="!tagHasOverflowed || !editable">
  <el-tag 
    :theme="fieldTheme" 
    v-show="!node.editable"
    type="pure" 
    @click="clickNodeName(node)" 
    class="edit-area-field-tag"  
    :title="tagName" >{{tagName}}</el-tag>
  </el-tooltip>
</span>
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
    editable: { type: Boolean},
  },
  computed: {
    fieldTheme() {
      const { type, paramsType, category, isLegal } = this.node;
      if ( type === 'field' || paramsType === 'field' || category === 'field' ) {
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
      initialCustomConstant: this.node.value,
      tagHasOverflowed: false,
    }
  },
  created() {
  },
  mounted() {
    if (this.editable) {
      // const $el = this.$children[0].$el.querySelector(".el-tag-content");
      // const {offsetWidth, scrollWidth} = $el
      // this.tagHasOverflowed = scrollWidth > offsetWidth;
    }
  },
  methods: {
    textOverflowed(e) {
      console.log('e :>> ', e);
      return true;
      // return ((e) => {
      // })()
    },
    clickNodeName(node) {
      if(!this.editable) return;
      this.$parent.clickNodeName(node);
      // console.log('node clickNodeName:>> ', node);
       if (node.paramsType === 'constant') {
        node.editable = true;
        this.cursor.disabled = true; //disabled: 常量未设置值时，禁用cursor，不可继续编辑公式
        return;
      }
    },
    blurCustomParams(node, blueEvent){
      // console.log('blurCustomParams :>> ');
      if( !node.value ) {
        node.tooltipVisible = true;
        setTimeout(() => {
          node.tooltipVisible = false;
        }, 5000)
      } else {
        node.editable = false;
        this.cursor.disabled = false; //disabled: 常量未设置值时，禁用cursor，不可继续编辑公式
        if(this.initialCustomConstant !== this.node.value && blueEvent) {
          this.cursor.pushSnapShot()
        }
      }
    },
  },
}
</script>