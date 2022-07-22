<template>
  <ul class="ul-struct" @mouseover.stop="$emit('setHoverNode', node)" @mouseleave="$emit('setHoverNode', null)">
    <li>
      <el-tooltip :enterable="false"  content="点击【分支判断】可移动光标到末尾" placement="top">
        <span class="inline-block default-symbol struct-name" @click="clickNodeName(node)">分支判断 </span>
      </el-tooltip>
      <ul v-for="(nodeList, nodeListIndex) in caseWhenThenList" :key="nodeListIndex"  >
        <FormulaCaseWhenThenNode
          :node="node"
          :whenThenNodelist="nodeList"
          :nodeListIndex="nodeListIndex"
          :prevCursor="prevCursor"
          :cursor="cursor"
          :selectedNode="selectedNode"
          :hoverNode="hoverNode"
          :editable="editable"
          v-on="$listeners"
          />
        <li>
        <button class="el-btn el-btn-text delete-when-then" type="button"
        v-if="editable && node.children.length > 2" 
        @click="$emit('deleteCaseWhenThen', {caseNode: node, whenThenIndex: nodeListIndex});"><span class="el-btn-before"><i class="mtdicon mtdicon-delete-o"></i></span></button>
        </li>
      </ul>
      <div class="case-btn-group">
        <el-button round size="small" v-if="editable " @click="$emit('increaseCaseWhenThen', {node});">增加条件</el-button>
        <el-button  round size="small" v-if="editable " @click="$emit('deleteCase', node);">删除分支</el-button>
      </div>
      <ul >
        <span class='inline-block default-symbol'>默认值</span>
        <el-button icon="el-icon-edit" circle size="mini"
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
          :prevCursor="prevCursor"
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
    prevCursor: {
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