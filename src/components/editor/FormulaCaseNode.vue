<template>
  <ul class="ul-struct" @mouseover.stop="$emit('setHoverNode', node)" @mouseleave="$emit('setHoverNode', null)">
    <li>
      <el-tooltip content="点击【分支判断】可移动光标到末尾" placement="top">
        <span class="inline-block default-symbol struct-name" @click="clickNodeName(node)">分支判断 </span>
      </el-tooltip>
      <el-icon-button icon="mtdicon mtdicon-add operate-case-btn" size="small" v-if="editable"
          @click="$emit('increaseCaseWhenThen', {node, operateLayerIndex: 0})"/>
      <ul v-for="(nodeList, nodeListIndex) in caseWhenThenList" :key="nodeListIndex"  >
        <FormulaCaseWhenThenNode
          :node="node"
          :whenThenNodelist="nodeList"
          :nodeListIndex="nodeListIndex"
          
          :cursor="cursor"
          :selectedNode="selectedNode"
          :hoverNode="hoverNode"
          :editable="editable"
          v-on="$listeners"
          />
        <li>
        <el-icon-button icon="mtdicon mtdicon-add operate-case-btn" size="small" v-if="editable"
          @click="$emit('increaseCaseWhenThen', {node, operateLayerIndex: nodeListIndex + 1})"/>
        <el-icon-button icon="mtdicon mtdicon-copy-o operate-case-btn" size="small" v-if="editable"
          @click="$emit('increaseCaseWhenThen', {node, operateLayerIndex: nodeListIndex + 1, copy: true})"/>
        <el-icon-button icon="mtdicon mtdicon-delete-o operate-case-btn" size="small"
          v-if="editable && node.children.length > 2"  
          @click="$emit('deleteCaseWhenThen', {caseNode: node, whenThenIndex: nodeListIndex});"  />
        </li>
      </ul>
      <ul >
        <span class='inline-block default-symbol'>默认值</span>
        <span class="cursor-placeholder " 
        v-if="cursor.place === 'caseDefaultValue' && cursor.layerIndex === node.children.length - 1 && cursor.index == 0 && cursor.parentNode.path === node.path"></span>
        <el-icon-button class="demo-icon-btn" type="secondary" icon="mtdicon mtdicon-edit-o" size="small"
                          v-if="editable && caseDefaultValueNodeList.length === 0 && 
                                cursor.place !== 'caseDefaultValue'" 
                          @click="$emit('editCaseStructExp',{
                            node,
                            nodeListIndex: node.children.length - 1,
                            place: 'caseDefaultValue',
                          })" />
        <FormulaNode
          v-for="(item, index) in caseDefaultValueNodeList"
          :key="item.path"
          :node="item"
          :nodeIndex="index"
          :editable="editable"
          
          :cursor="cursor"
          :selectedNode="selectedNode"
          :hoverNode="hoverNode"

          v-on="$listeners"
        ></FormulaNode>
      </ul>
    </li>  
  </ul>
</template>
<script>
import FormulaCaseWhenThenNode from '@/components/editor/FormulaCaseWhenThenNode'
export default {
  name: 'FormulaCaseNode',
  components: {
    FormulaNode: () => import('@/components/editor/FormulaNode'),
    FormulaCaseWhenThenNode
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
  computed: {
    caseWhenThenList(){
      return this.node.children.slice(0, this.node.children.length - 1);
    },
    caseDefaultValueNodeList() {
      return this.node.children.slice(-1)[0];
    },
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
<style lang="less" scoped>
.operate-case-btn{
  font-size: 12px;
  height: 20px;
  width: 20px;
  padding: 4px;
}
</style>