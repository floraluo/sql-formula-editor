<template>
  <span>
    <span @click="$parent.clickNodeName(node)" class="struct-name">{{ node.name }}(</span>
    <ul class="inline-block" v-for="(paramsArr, arrIndex) in node.children" :key='arrIndex'>
      <el-tooltip placement="top" 
      v-show="!paramsArr[0].disabled" 
      content="常量不能为空" 
      trigger="focus" 
      :visible="paramsArr[0].tooltipVisible && !paramsArr[0].value">
        <el-input
        v-show="!paramsArr[0].disabled" 
        v-model="paramsArr[0].value" 
        :disabled="paramsArr[0].disabled" 
        v-focus 
        @blur="blurCustomParams(node)"
        ref="input"
        size="small"
        class="constant-input"></el-input>
      </el-tooltip>
      <el-tag theme="gray" 
      type="pure" 
      v-show="paramsArr[0].disabled" 
      @click="clickCustomParams(node, paramsArr[0])">{{paramsArr[0].value}}</el-tag>
      <span class="default-symbol" v-if="arrIndex < node.children.length - 1">,</span>
    </ul>
    <span> ) </span>
  </span>
</template>
<script>
export default {
  name: 'FormulaLikeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    cursor: { type: Object},
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    clickCustomParams(node, customParams){
      customParams.disabled = false;
      this.$emit('moveCursor', {...node, input: true});
      setTimeout(() => {
        this.$refs.input[0].focus();
      });
    },
    blurCustomParams(node){
      if( !node.children[0][0].value ) {
        node.children[0][0].tooltipVisible = true;
        setTimeout(() => {
          node.children[0][0].tooltipVisible = false;
        }, 5000)
      } else {
        node.children[0][0].disabled = true;
        // this.$emit('moveCursor', node);

      }
    },
  },
}
</script>