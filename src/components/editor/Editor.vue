<template>
  <el-row  id="editor">
    <el-col :span="24">
      <div class="editor-btn-group">
        <el-row class="row-category">
          <div class="btn-category-name">基本符号</div>
          <div class="btn-same-category-group">
            <el-tooltip  size="small" placement="top" :disabled="!btn.desc" v-for="btn in baseSignBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
              <span v-html="btn.char"></span>
            </el-button>
          </el-tooltip>
            
          </div>
        </el-row>
        <el-row class="row-category" v-show="fieldType !== 'attribute' && fieldType !== 'field'">
          <div class="btn-category-name">聚合函数</div>
          <div class="btn-same-category-group">
            <el-tooltip  size="small" placement="top" :disabled="!btn.desc" v-for="btn in aggregateBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
                <span v-html="btn.char"></span>
              </el-button>
            </el-tooltip>
          </div>
        </el-row>
        <el-row class="row-category">
          <div class="btn-category-name">数学函数</div>
          <div class="btn-same-category-group">
            <el-tooltip  size="small" placement="top" v-for="btn in mathBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
                <span v-html="btn.char"></span>
              </el-button>
            </el-tooltip>
          </div>
        </el-row>
        <el-row class="row-category">
          <div class="btn-category-name">日期函数</div>
          <div class="btn-same-category-group">
            <el-tooltip  size="small" placement="top" v-for="btn in dateBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
                <span v-html="btn.char"></span>
              </el-button>
            </el-tooltip>
          </div>
        </el-row>
        <el-row class="row-category">
          <div class="btn-category-name">类型</div>
          <div class="btn-same-category-group">
            <el-tooltip :disabled="!btn.desc"  size="small" placement="top" v-for="btn in dataTypeBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
                <span v-html="btn.char"></span>
              </el-button>
            </el-tooltip>
          </div>
        </el-row>
        <el-row class="row-category">
          <div class="btn-category-name">其他</div>
          <div class="btn-same-category-group">
            <el-tooltip  size="small" placement="top" v-for="btn in otherBtnGroup" :key="btn.name" >
              <template slot="content">
                <span v-html="btn.desc"></span>
              </template>
              <el-button size="small"  @click="editExpression({btn})">
                <span v-html="btn.char"></span>
              </el-button>
            </el-tooltip>
          </div>
        </el-row>
        <el-row class="row-category" v-show="editable">
          <div class="btn-category-name">自定义常量</div>
          <div class="btn-same-category-group">
            <el-tooltip  placement="top" content="请输入常量" :visible="!constantValue && constantTooltipVisible">
              <el-input size="small" placeholder="请输入常量" 
                v-model="constantValue" 
                @keyup.enter="addConstant"
                @change="constantTooltipVisible = false"/>
            </el-tooltip>
            <el-button size="small" @click="addConstant" style="margin-left:15px">确定</el-button>
          </div>
        </el-row>
        <el-row class="row-category">
          <div class="btn-category-name">常用功能</div>
          <div class="btn-same-category-group">
            <el-button size="small" @click="handleDeleteNode">删除</el-button>
            <el-button size="small" @click="handleEmptyNode">清空</el-button>
            <el-button size="small" @click="handlePasteNode" :disabled="!editable">粘贴</el-button>
            <el-button size="small" @click="handleCopyNode">复制</el-button>
            <el-button size="small" @click="handleCutNode">剪切</el-button>
            <!-- 记录总数：{{cursor.snapshots.pool.size}}
            指针位置：{{cursor.snapshots.pointer}} -->
            <el-button size="small" @click="handleUndoInsertNode" :disabled="!undoAble">撤销</el-button>
            <el-button size="small" @click="handleRedoInsertNode" :disabled="!redoAble">恢复</el-button>
          </div>
          <div class="switch-enterable-edit">
            <el-popover 
              v-if="visible"
              popper-class="popover-sql-text" 
              :show-arrow="false" 
              :visible="previewSqlTextVisible" 
              trigger="click" 
              placement="bottom" 
            >
              <el-button 
                size="small" 
                type="primary" 
                v-show="editable" 
                @click="handlePreviewSqlText"
              >
                编辑模式
              </el-button>
              <div slot="content" class="popover-sql-text-content" >
                <div class="editor-text-formula" id="sqlTextContainer" >
                  <FormulaTextEditor
                    ref="enterableEditBox"
                    :visible="visible"
                    :sqlHtml="sqlHtml"
                    :type="fieldType"
                    :selectPanel="$refs['selectPanel']"
                  />
                  <AutoSelectList 
                    ref="selectPanel"
                    v-show="showAutoSelectList" 
                    :type="fieldType"
                    listType="field"/>
                </div>
                <div class="form-btn-group mt10 mb20 tr gutter">
                  <p class="popover-sql-text-desc">编辑模式模式下可用函数范围和配置模式相同，字段通过输入 # 检索，暂不支持的函数如有需要需，请联系管理员</p>
                  <el-button size="small" @click="handleClosePopoverSqlText" >取消</el-button>
                  <!-- <el-button size="small" type="primary" @click="handleText2Node">解析</el-button> -->
                </div>
              </div>
            </el-popover>
          </div>
        </el-row>
      </div>
    </el-col>
    
    <el-col :span="24" id="editArea" class="editor-edit-area">
        <Formula
          :nodes="rootNode.children"

          :cursor="cursor"
          :selectedNode="selectedNode"
          :hoverNode="hoverNode"
          :editable="editable"
          v-on="$listeners"
          @moveCursorToFirst="moveCursorToFirst"
          @increaseCaseWhenThen="increaseCaseWhenThen"
          @moveCursor="moveCursor"
          @selectedNode="setSelectedNode"
          @deleteCaseWhenThen="deleteCaseWhenThen"
          @editCaseStructExp="editCaseStructExp"
          @editParams="editParams"
          @setHoverNode="setHoverNode"
          @editExpression="editExpression"
          @deleteNode="handleDeleteNode"
        />
    </el-col>
  </el-row>
</template>
<script>
import editorButtonsMap from '@/lib/editorButtonsMap'
import Formula from '@/components/editor/Formula'
import FormulaTextEditor from '@/components/enterableEditor/FormulaTextEditor'
import AutoSelectList from '@/components/enterableEditor/AutoSelectList'

import { deepCopy } from '@/lib/util'
import Node from '@/components/editor/Node.js'
import Cursor from '@/components/editor/Cursor'
import formatFormula from '@/utils/formatFormula'
import { parseFormulaText } from '@/components/enterableEditor/FormulaTextEditor_utils'
import parseFormula from '@/utils/parseFormula.js'

import { storeToRefs } from 'pinia'

import { useModalFieldStore } from '@/store/modal/modalFieldStore'
import { useSqlTextEditorStore } from '@/store/modal/sqlTextEditor';
import { useFieldStore } from '@/store/dataSet/fieldStore';
import { SUCCESS_CODE } from '@/lib/constant'
export default {
  name: 'Editor',
  components: { Formula, FormulaTextEditor, AutoSelectList },
  props: {
    // 指标、属性请求接口成功后设置true
    // formulaModelReady: { type: Boolean},
    // formulaModel: {
    //   type: Array, 
    //   default: () => []
    // },
    fieldType: { type: String }, //quota, attribute, field
    editable: { type: Boolean, default: true },
    visible: { type: Boolean },
    fieldListAvailable: { type: Array}

  },
  computed: {
    baseSignBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'baseSign');
    },
    aggregateBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'aggregate');
    },
    mathBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'math');
    },
    dateBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'date');
    },
    dataTypeBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'type');
    },
    otherBtnGroup () {
      return editorButtonsMap.btnGroup.filter(btn => btn.layoutType === 'other');
    },
    undoAble() {
      return this.cursor.snapshots.pointer > 1;
    },
    redoAble() {
      return this.cursor.snapshots.pool.get(this.cursor.snapshots.pointer);
    }
  },
  watch: {
    visible: function(value) {
      console.log('value :>> ', value);
      if (!value) {
        this.cursor = new Cursor(this.rootNode);
        this.selectedNode = null;
        this.copiedNode = null;
        this.previewSqlTextVisible = false;
        
      } else {
        // console.log('this.rootNode :>> ', this.rootNode);
        this.cursor.index = this.rootNode.children.length;
        this.cursor.initPrev(this.rootNode.children.slice(-1)[0])
        this.cursor.pushSnapShot(this.rootNode)
      }
    },
  },
  data() {
    return {
      cursor: new Cursor(this.rootNode),
      hoverNode: null,

      constantValue: '',
      constantTooltipVisible: false,

      selectedNode: null,
      copiedNode: null,
      previewSqlTextVisible: false
    }
  },
  setup() {
    const modalFieldStore = useModalFieldStore();
    // const dataSetStore = useDataSetStore();
    // dataSetStore.$reset()
    // fieldStore.$reset();
    const { fieldConfigInfo, rootNode } = storeToRefs(modalFieldStore)
    const sqlTextEditorStore = useSqlTextEditorStore();
    const { showAutoSelectList, sqlHtml } = storeToRefs(sqlTextEditorStore);

    return {
      modalFieldStore,
      fieldConfigInfo,
      rootNode,
      sqlHtml,
      showAutoSelectList,
    }
  },
  created() {
    this.cursor = new Cursor(this.rootNode);
        this.selectedNode = null;
        this.copiedNode = null;
        this.previewSqlTextVisible = false;
    console.log('this.cursor :>> ', this.cursor, this.rootNode);
  },
  methods: {
    async text2Node() {
      const result = await this.$API.manage.text2node({
        fieldText: this.getSqlText()
      })
      if (result.code === SUCCESS_CODE) {
        const fieldStore = useFieldStore();
        const { fieldList } = fieldStore;
        const autoReplace = true;
        const formulaRenderModel = parseFormula(result.data.fieldConfig.nodes, this.fieldListAvailable, autoReplace); 
        this.rootNode.children = formulaRenderModel
      }
      return result;
    },
    async node2Text() {
      const result = await this.$API.manage.node2text({
        fieldConfig: {
          type: 'nodeList',
          nodes: formatFormula(this.rootNode.children)
        }
      })
      if (result.code === SUCCESS_CODE) {
        const sqlText = result.data.fieldText;
        const fieldStore = useFieldStore();
        const { fieldList } = fieldStore;
        const autoReplace = true;
        this.sqlHtml = parseFormulaText(sqlText, this.fieldListAvailable, autoReplace);
        
      }
      return result;
    },
    handlePreviewSqlText() {
      if (!this.previewSqlTextVisible) {
        this.node2Text().then((result) => {
          if (result.code === SUCCESS_CODE) {
            this.previewSqlTextVisible = true;
          }
        })
      } else {
        this.previewSqlTextVisible = false;
      }
    },
    handleText2Node() {
      this.text2Node().then((result) => {
        if (result.code === SUCCESS_CODE) {
          this.previewSqlTextVisible = false;
        }
      })
    },
    handleClosePopoverSqlText() {
      this.previewSqlTextVisible = false;
      this.sqlHtml = '';
      this.$refs['enterableEditBox'].$el.innerHTML = '';
    },
    // handleKeyDown(e) {
    //   console.log('showAutoSelectList :>> ', this.showAutoSelectList);
    //   if (e.key === 'ArrowDown' && this.showAutoSelectList) {
    //     e.preventDefault();
    //   }
    // },
    getSqlText() {
      const $editBox = this.$refs['enterableEditBox'];
      return $editBox.getSqlText();
    },
    contenteditableKeyUp(e) {
      let selection = window.getSelection ? window.getSelection() : document.selection
      let range = selection.createRange ? selection.createRange() : selection.getRangeAt(0)
      // console.log("selection, range :>> ", selection, range);
    },
    handleUndoInsertNode(){
      let snapshot;
      if (this.cursor.snapshots.pointer > 1) {
        snapshot = this.cursor.snapshots.pool.get(this.cursor.snapshots.pointer - 2)
        --this.cursor.snapshots.pointer;
        this._resetFormula(snapshot)
      }
    },
    handleRedoInsertNode() {
      const snapshot = this.cursor.snapshots.pool.get(this.cursor.snapshots.pointer);
      if (snapshot) {
        ++this.cursor.snapshots.pointer;
        this._resetFormula(snapshot)
      }
    },
    _resetFormula(snapshot) {
      this.rootNode.children.splice(0);
      this.rootNode.reset(snapshot.rootNode);
      this.cursor.reset(snapshot.cursor);
      // console.log('rest this.rootNode :>> ', this.rootNode);
    },
    handleEmptyNode() {
      this.rootNode.children.splice(0);
      this.cursor.init();
      this.cursor.pushSnapShot();
      this.selectedNode = null;
    },
    async handleCopyNode({isCut = false}){
      let copyNode, copySuccessMsg;
      let operateText = isCut ? '剪切' : '复制';
      if (this.selectedNode) {
        copyNode = this.selectedNode;
        let nodeName = copyNode.name || '';
        let nodeTypeName = copyNode.type === 'field' ? '字段' : '公式';
        copySuccessMsg = `${nodeName}${nodeTypeName}${operateText}成功`;
      } else {
        if (this.rootNode.children.length === 0) {
          this.$message({
            message: `您还没有添加公式，${operateText}失败！`,
            type: 'error',
          })
          return false;
        } else {
          copyNode = this.rootNode;
          copySuccessMsg = `公式${operateText}成功`;
        }
      }
      const nodeJsonString = copyNode.getString;
      return this.$copyText(nodeJsonString).then(text => {
        this.$message({
          message: copySuccessMsg,
          type: 'success'
        })
        if (!isCut) {
          this.selectedNode = null;
        }
        return true;
      }, (err) => {
        this.$message({
          message: `${operateText}失败`,
          type: 'error'
        });
        console.error(err);
        return false;
      })
    },
    handleCutNode(){
      this.handleCopyNode({isCut: true}).then(copySuccess => {
        if (copySuccess) {
          if (this.selectedNode) { //有选中节点，执行删除
            this.handleDeleteNode();
            this.selectedNode = null;
          } else {
            this.handleEmptyNode(); //剪切整个公式，执行清空
          }
        }
      })
    },
    _validClipboardNode(clipboardText) {
      const regValidJson = /^\{(.+:.+,*){1,}\}$/;
      let validResult = regValidJson.test(clipboardText);
      if (validResult) {
        const node = JSON.parse(clipboardText);
        if (!node && !node.renderType){
          this.$message({
            message: '剪贴板内容不是有效的节点',
            type: 'warning'
          })
          validResult = false;
        }
      } else {
        this.$message({
          message: '剪贴板内容不是有效的节点',
          type: 'warning'
        })
      }
      return validResult;
      
    },
    async handlePasteNode(){
      try {
        const clipboardText = await navigator.clipboard.readText(); //读取剪贴板内容
        if (this._validClipboardNode(clipboardText)) { //验证剪贴板文字是否合法的节点对象json字符串
          this.copiedNode = JSON.parse(clipboardText);
          const copiedNodeJson = JSON.parse(clipboardText);
          console.log('this.fieldListAvailable :>> ', this.fieldListAvailable);
          if (this.copiedNode.name === 'root') {
            this.cursor.patchInsertNodeOfPaste(copiedNodeJson.children, this.fieldListAvailable)
          } else {
            // const pasteNode = this._initCopiedNode(copiedNodeJson)
            this.cursor.insertNodeOfPaste(copiedNodeJson, this.fieldListAvailable)
          }
          // this.cursor.pushSnapShot();
  
          this.copiedNode = null;
          this.selectedNode = null; //复制选中节点粘贴后，清空选中节点即取消此节点的高亮下划线样式
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '粘贴错误，请确认剪贴板权限是否开启。http协议浏览器禁止访问剪贴板，请使用https协议！',
        })
        console.error('Failed to read clipboard contents: ', err);
      }
    },
    addConstant(){
      if (!!this.constantValue) {
        this.editExpression({
          btn: {
            category: 'constant',
            renderType: 'tag',
            paramsType: 'constant',
            value: this.constantValue,
            editable: false,
            tooltipVisible: false,
          }
        })
        this.constantValue = '';
      } else {
        this.constantTooltipVisible = true;
        setTimeout(() => {
          this.constantTooltipVisible = false;
        }, 2000);
      }
    },
    _message(message, type){
      this.$message({
        message,
        type
      })
    },
    _getCursorPathArr(cursorPath) {
      let path = cursorPath || this.cursor.path;
      return path.split('-');
    },
    //树形结构布局：鼠标进入记录节点
    setHoverNode(hoverNode){
      this.hoverNode = hoverNode;
    },
    editCaseStructExp({
      node,
      nodeListIndex,
      place
    }){
      this.cursor.initPrev();
      // this.prevCursor.category = null;
      // this.cursor.prevPath = null;
      // this.cursor.prevPlace = place;
      this.cursor.place = place;
      this.cursor.parentNode = node;
      const parentNodePath = node.path;
      if(place === 'caseCondition' || place === 'caseDefaultValue'){
        this.cursor.index = 0;
        this.cursor.layerIndex = nodeListIndex;
        // this.cursor.path = `${parentNodePath}-${nodeListIndex}-0`;
      } else if (place === 'caseValue') {
        const sameLevelConditionNodeList = node.children[nodeListIndex].filter(node => node.place === 'caseCondition');
        const sameLevelConditionNodeLen = sameLevelConditionNodeList.length;
        this.cursor.index = sameLevelConditionNodeLen;
        this.cursor.layerIndex = nodeListIndex;
      }
    },
    _cursorDisabled() {
      if (this.cursor.disabled){
        this.$message({
          message: '有未设置的常量，不可编辑！',
          type: 'info'
        })
      }
      return this.cursor.disabled;
    },
    editParams({ node, paramsArrIndex, place}){
      if (this._cursorDisabled()) return ;
      this.cursor.initPrev();
      // this.cursor.prevPath = null;
      // this.prevCursor.category = null;
      // this.cursor.prevPlace = place;
      this.cursor.index = 0;
      this.cursor.layerIndex = paramsArrIndex;
      this.cursor.place = place;
      this.cursor.parentNode = node;
      if (node.renderType === 'dynamicParams') {
        if (node.children.filter(paramsArr => paramsArr.length === 0).length  <= 1){
          node.children.push([]);
        }
      }
    },
    editExpression({btn}) {
      if (!this.editable || this.previewSqlTextVisible) return;
      // 输入常量禁用光标
      if (this._cursorDisabled()) return ;
      // 输入常量时，cursor.path = null
      if (!this.cursor.path) return;
      // let node = this._initNode(btn);
      console.log('this.cursor.verticalIndex :>> ', this.cursor.verticalIndex);
      const node = new Node({
        opt: {
          ...btn,
          place: this.cursor.place,
          nodeIndex: this.cursor.index,
          layerIndex: this.cursor.layerIndex,
          verticalIndex: this.cursor.verticalIndex
        },
        parentNode: this.cursor.parentNode,
      })
      

      // 点击函数、语句块，增加子层id
      // 点击数字、操作符，增加同层id
      // 当前光标id改变后，比对上一次光标id：
      // 在同一层，则判断上一次和本次光标处输入的数据类型，均为数字，当前数字拼接到上一次输入的数字

      let pathArr = this._getCursorPathArr();
      let parent = this.rootNode;
      pathArr.forEach((pathIndex, index) => {
        if (index + 1 < pathArr.length) {
          parent = parent.children && parent.children[pathIndex] || parent[pathIndex];
        }
      });

      
      // 点击数字、操作符
      // this.btnOperateMap[btn.renderType](parent, node, btn);
      if (btn.category === 'digit'
        && this.cursor.prevCategory === btn.category
        // &&this.cursor.layerIndex === node.layerIndex) {
        &&this.cursor.prevPath.split('-').length === node.path.split('-').length) {
          // 光标前的节点类型和本次输入节点都是数字式，不做新增节点操作，更新光标前节点的值
          const beforeCursorNode = this.cursor.getBeforeCursorNode();
          const nodeValue = beforeCursorNode.value;
          beforeCursorNode.value = `${nodeValue}${btn.name}`; 
          this.cursor.pushSnapShot(this.rootNode)
      }  else {
        this.cursor.insertNode(node)
      }
      this.selectedNode = null;
    },
    // 点击删除按钮，删除节点
    handleDeleteNode() {
      if (this.cursor.prevPath === null && this.cursor.prevPlace) {
        this._message('别删了，已经到头啦！', 'info');
        return;
      }
      if (this.cursor.index == 0) {
        this._message('别删了，已经到头啦！', 'info');
        return 
      }
      this.cursor.parentNode.deleteNode(this.cursor.index - 1, this.cursor.layerIndex);
      this.cursor.updateAfterDeleteNode();
      this.cursor.pushSnapShot();
      if (this.rootNode.children.length === 0) {
        this.selectedNode = null;
      }
    },
    moveCursorToFirst(node) {
      this.cursor.initPrev();
      this.cursor.index = node.nodeIndex;
      this.cursor.layerIndex = node.layerIndex
      this.cursor.place = node.place;
      this.cursor.parentNode = node.parentNode;
    },
    moveCursor(node) {
      // console.log('moveCursor :>> ', node);
      // 点击node移动光标
      this.cursor.initPrev(node);
      this.cursor.place = node.place
      this.cursor.index = node.nodeIndex + 1;
      this.cursor.layerIndex = node.layerIndex;
      this.cursor.verticalIndex = node.verticalIndex;
      this.cursor.parentNode = node.parentNode;
      // this.cursor.path = this._pathStepForward(node.path);
    },
    setSelectedNode({node, selected}) {
      if (selected) {
        this.selectedNode = node;
      } else {
        this.selectedNode = null;
      }
    },
    increaseCaseWhenThen({
      node,
      operateLayerIndex,
      copy = false
    }) {
      node.insertLayer({layerIndex: operateLayerIndex, copy});
      this.cursor.updateAfterInsertCaseWhenThen(node, operateLayerIndex);
      this.cursor.pushSnapShot(this.rootNode)
    },
    deleteCaseWhenThen({ caseNode, whenThenIndex }) {
      caseNode.deleteLayer(whenThenIndex)
      this.cursor.updateAfterDeleteCaseWhenThen(caseNode, whenThenIndex);
      this.cursor.pushSnapShot();
    },
  }
}
</script>
<style lang="less">
.editor-text-formula{
  #sqlTextCE{
    min-height: 80px;
  }
}
.popover-sql-text-content{
  position: relative;
}
.popover-sql-text.el-popper{
  right: 6%;
  left: 35% !important;
  box-shadow: 0 -2px 4px 0 rgba(0,0,0,10%), 0 2px 6px 6px rgba(0,0,0,10%), 0 2px 6px 0 rgba(0,0,0,20%);
}
.popover-sql-text-desc{
  position: absolute;
  font-size: 12px;
  color: #666;
}
</style>
<style lang="less" scoped>
.editor-text-formula{
  padding: 5px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 4px;
  height: 100px;
  overflow-x: auto;
  white-space: nowrap;
  // position: relative;
}
.editor-btn-group{
  .el-btn{
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.row-category {
  padding-left: 6em;
  margin-bottom: 7px;
}
.btn-category-name{
  position: absolute;
  margin-left: -6em;
  margin-top: 2px;
}
.editor-edit-area {
  padding: 5px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 4px;
  min-height: 100px;
  overflow-x: auto;
}
.switch-enterable-edit{
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}
</style>