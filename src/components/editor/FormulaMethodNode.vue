<template>
<span>
  <span @click="clickNodeName(node)" class="start-char" >{{ node.name === 'if' ? node.exportChar : node.name }}(</span>

  <ul class="inline-block" v-for="(paramsArr, arrIndex) in node.children" :key='arrIndex'>
    <!-- <span class="cursor-placeholder " 
          v-if="paramsArr.length === 0 && 
                `${node.path}-${arrIndex}-0` === cursor.path && 
                cursor.place === node.renderType"></span>
    <el-button class="" icon="el-icon-edit" circle size="mini"
                      v-else-if="editable && paramsArr.length === 0 && 
                            `${node.path}-${arrIndex}-0` !== cursor.path " 
                      @click="$emit('editParams',{
                        node,
                        paramsArrIndex: arrIndex,
                        place: node.renderType
                      })" /> -->
                      <!-- {{cursor.parentNode === node}} -->
    <span class="cursor-placeholder " 
      v-if="
      paramsArr.length === 0 
      && `${node.path}-${arrIndex}-0` === cursor.path
      && cursor.place === node.renderType"
    ></span>
  <el-button icon="el-icon-edit" circle size="mini"
    v-else-if="
      editable 
      && paramsArr.length === 0" 
      @click="$emit('editParams',{ node, paramsArrIndex: arrIndex, place: node.renderType })" 
    />
    <!-- {{arrIndex}} -->
    <!-- {{node.verticalIndex}} -{{cursor.verticalIndex}} -->
    <FormulaNode
      v-for="(item, index) in paramsArr"
      :key="index"
      :node="item"
      :nodeIndex="index"
      :editable="editable"
      
      :cursor="cursor"
      :selectedNode="selectedNode"
      :hoverNode="hoverNode"
      v-on="$listeners"
    ></FormulaNode>
    <span class="default-symbol" v-if="arrIndex < node.children.length - 1">,</span>
  </ul>
  <span>)</span>
</span>
</template>
<script>
export default {
  name: 'FormulaMethodNode',
  components: {
    FormulaNode: () => import('@/components/editor/FormulaNode'),
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    cursor: {
      type: Object,
      required: true
    },
    editable: { type: Boolean },
    selectedNode: { type: Object },
    hoverNode: { type: Object }
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

    },
  },
}
</script>