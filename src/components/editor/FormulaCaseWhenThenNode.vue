<template>
<li>
  <span class='inline-block default-symbol'>条件：</span>

  <span class="cursor-placeholder " 
        v-if="showCursorOfTheConditionPlace"></span>

  <el-button icon="el-icon-edit" circle size="mini"

                    v-else-if="showEditBtnOfTheConditionPlace" 
                    @click="$emit('editCaseStructExp',{
                      node,
                      nodeListIndex,
                      place: 'caseCondition',
                    })" />
  <FormulaNode
    v-for="(item, index) in conditionNodeList"
    :key="item.path"
    :node="item"
    :nodeIndex="index"
    :editable="editable"
    
    :cursor="cursor"
    :selectedNode="selectedNode"
    :hoverNode="hoverNode"

    v-on="$listeners"
  ></FormulaNode>
  <span class="inline-block default-symbol then">公式：</span>
  <span class="cursor-placeholder " 
        v-if="showCursorOfTheValuePlace"></span>
  <el-button icon="el-icon-edit" circle size="mini"
                    v-if="showEditBtnOfTheValuePlace" 
                    @click="$emit('editCaseStructExp',{
                      node,
                      nodeListIndex,
                      place: 'caseValue',
                    })" />
  
  <FormulaNode
    v-for="(item, index) in valueNodeList"
    :key="item.path"
    :node="item"
    :nodeIndex="index"
    :editable="editable"
    
    :cursor="cursor"
    :selectedNode="selectedNode"
    :hoverNode="hoverNode"

    v-on="$listeners"
  ></FormulaNode>
</li>
</template>
<script>
export default {
  name: 'FormulaCaseWhenThenNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    whenThenNodelist: {
      type: Array,
      required: true
    },
    nodeListIndex: {
      type: Number,
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
  components: {
    FormulaNode: () => import('@/components/editor/FormulaNode')
  },
  computed: {
    showCursorOfTheConditionPlace(){
      return  this.conditionNodeList.length === 0 && 
      `${this.node.path}-${this.nodeListIndex}-0` === this.cursor.path && 
      this.cursor.place === 'caseCondition'
    },
    showCursorOfTheValuePlace(){
      return  this.valueNodeList.length === 0 && 
      `${this.node.path}-${this.nodeListIndex}-${this.conditionNodeList.length}` === this.cursor.path && 
      this.cursor.place === 'caseValue'
    },
    showEditBtnOfTheConditionPlace(){
      return this.editable && 
      this.conditionNodeList.length === 0 && 
      !this.showCursorOfTheConditionPlace;
    },
    showEditBtnOfTheValuePlace(){
      return  this.editable && 
      this.valueNodeList.length === 0 && 
      !this.showCursorOfTheValuePlace
    },
    conditionNodeList() {
      return this.whenThenNodelist.filter(node => node.place === 'caseCondition');
    },
    valueNodeList() {
      return this.whenThenNodelist.filter(node => node.place === 'caseValue');
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