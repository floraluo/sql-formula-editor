<template>
  <el-row  id="editor">
    <el-col :span="24">
      <div class="editor-btn-group">
        <el-row class="row-category">
          <div class="btn-category-name">基本符号</div>
          <div class="btn-same-category-group">
            <el-tooltip :enterable="false"  size="small" placement="top" :disabled="!btn.desc" v-for="btn in baseSignBtnGroup" :key="btn.name" >
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
            <el-tooltip :enterable="false"   size="small" placement="top" :disabled="!btn.desc" v-for="btn in aggregateBtnGroup" :key="btn.name" >
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
            <el-tooltip :enterable="false"   size="small" placement="top" v-for="btn in mathBtnGroup" :key="btn.name" >
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
            <el-tooltip :enterable="false"   size="small" placement="top" v-for="btn in dateBtnGroup" :key="btn.name" >
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
            <el-tooltip :enterable="false"  :disabled="!btn.desc"  size="small" placement="top" v-for="btn in dataTypeBtnGroup" :key="btn.name" >
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
            <el-tooltip :enterable="false"   size="small" placement="top" v-for="btn in otherBtnGroup" :key="btn.name" >
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
          <div class="btn-category-name">自定义常量</div>
          <div class="btn-same-category-group">
            <el-tooltip :enterable="false"   placement="top" content="请输入常量" :visible="!constantValue && constantTooltipVisible">
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
            <el-button size="small" @click="deleteNode">删除</el-button>
            <el-button size="small" @click="emptyNode">清空</el-button>
            <el-button size="small" @click="pasteNode">粘贴</el-button>
            <el-button size="small" @click="copyNode" >复制</el-button>
          </div>
        </el-row>
      </div>
    </el-col>
    <el-col :span="24" id="editArea" class="editor-edit-area">
      <Formula
        :nodes="rootNode.children"
        :prevCursor="prevCursor"
        :cursor="cursor"
        :selectedNode="selectedNode"
        :hoverNode="hoverNode"
        :editable="editable"
        v-on="$listeners"
        @moveCursorToFirst="moveCursorToFirst"
        @moveStructCursorToFirst="moveStructCursorToFirst"
        @increaseCaseWhenThen="increaseCaseWhenThen"
        @deleteCase="deleteCase"
        @moveCursor="moveCursor"
        @selectedNode="setSelectedNode"
        @deleteCaseWhenThen="deleteCaseWhenThen"
        @editCaseStructExp="editCaseStructExp"
        @editParams="editParams"
        @setHoverNode="setHoverNode"
        @editExpression="editExpression"
        @deleteNode="deleteNode"
      />
    </el-col>
  </el-row>
</template>
<script>
import editorButtonsMap from '@/lib/editorButtonsMap'
import Formula from '@/components/editor/Formula'
import { deepCopy } from '@/lib/util'
import { useModalFieldStore } from '@/store/modal/modalFieldStore'
import { storeToRefs } from 'pinia'
import { useFieldStore } from '@/store/dataSet/fieldStore';

export default {
  name: 'Editor',
  components: { Formula },
  props: {
    fieldType: { type: String, default: 'quota' }, //quota, attribute, field
    editable: { type: Boolean, default: true },
    visible: { type: Boolean },
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
  },
  watch: {
    visible: function(value) {
      if (!value) {
        this.prevCursor = this._initPrevCursor();
        this.cursor = this._initCursor();
        this.selectedNode = null;
        this.copiedNode = null;
        
      }
    },
  },
  data() {
    return {
      // rootNode: {
      //   name: 'root',
      //   children: this.formulaModel
      // },
      cursor: this._initCursor(),
      prevCursor: this._initPrevCursor(),
      hoverNode: null,

      constantValue: '',
      constantTooltipVisible: false,

      selectedNode: null,
      copiedNode: null,
    }
  },
  setup() {
    const modalFieldStore = useModalFieldStore();
    // const dataSetStore = useDataSetStore();
    // dataSetStore.$reset()
    // fieldStore.$reset();
    const { fieldConfigInfo, rootNode } = storeToRefs(modalFieldStore)
    return {
      modalFieldStore,
      fieldConfigInfo,
      rootNode
    }
  },
  created() {
    // document.addEventListener('paste', async (e) => {
    //   e.preventDefault();
    //   const text = await navigator.clipboard.readText();
    //   console.log('Pasted text: ', text);
    // });
  },
  methods: {
    

    // _initRootNode(){
    //   return {
    //     name: 'root',
    //     children: []
    //   }
    // },
    async copyNode(){
      let copyNode, copySuccessMsg;
      if (this.selectedNode) {
        copyNode = deepCopy(this.selectedNode);
        let nodeName = copyNode.name || '';
        copySuccessMsg = `${nodeName}公式复制成功`;
      } else {
        if (this.rootNode.children.length === 0) {
          this.$message({
            message: '您还没有添加公式，复制失败！',
            type: 'error',
          })
          return;
        } else {
          copyNode = deepCopy(this.rootNode);
          copySuccessMsg = '公式复制成功';
        }
      }
      this.$copyText(JSON.stringify(copyNode)).then(text => {
        this.$message({
          message: copySuccessMsg,
          type: 'success'
        })
        this.selectedNode = null;
      }, (err) => {
        this.$message({
          message: '复制失败',
          type: 'error'
        });
        console.error(err);
      })
    },
    async getClipboardNode() {
      try {
        const text = await navigator.clipboard.readText();
        console.log('text :>> ', text);
        return JSON.parse(text);
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        return false;
      }
    },
    _validClipboardNode(clipboardText) {
      const regValidJson = /^\{(.+:.+,*){1,}\}$/;
      let validResult = regValidJson.test(clipboardText);
      if (validResult) {
        const node = JSON.parse(clipboardText);
        if (!node && !node.paramsType){
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
    emptyNode() {
      this.rootNode.children.splice(0);
      this.prevCursor = this._initPrevCursor();
      this.cursor = this._initCursor();
      this.selectedNode = null;
    },
    async pasteNode(){
      try {
        const clipboardText = await navigator.clipboard.readText(); //读取剪贴板内容
        // console.log('this.copiedNode :>> ', this.copiedNode);
        if (this._validClipboardNode(clipboardText)) { //验证剪贴板文字是否合法的节点对象json字符串
          this.copiedNode = JSON.parse(clipboardText);

          if (this.copiedNode.name === 'root') {
            // this.rootNode = this.copiedNode;
            const lastNodeInRoot = this.copiedNode.children[this.copiedNode.children.length - 1];
            // this._updateCursorAfterPaste(lastNodeInRoot);
            this.copiedNode.children.forEach(node => {
              this._insertCopiedNode(node);
            })
          } else {
            this._insertCopiedNode(this.copiedNode);
            // this._initCopiedNode(this.copiedNode);
            // this._updateNodePath(this.copiedNode);
            // this._insertNode(this.copiedNode)
            // this._updateCursorAfterPaste(this.copiedNode);
          }
  
          this.copiedNode = null;
          this.selectedNode = null; //复制选中节点粘贴后，清空选中节点即取消此节点的高亮下划线样式
          console.log('after paste node this.rootNode :>>>>>>>>>>>> ', this.rootNode);
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '粘贴错误，请确认剪贴板权限是否开启。http协议浏览器禁止访问剪贴板，请使用https协议！',
        })
        console.error('Failed to read clipboard contents: ', err);
      }
    },
    _insertCopiedNode(copiedNode) {
      this._initCopiedNode(copiedNode);
      this._updateNodePath(copiedNode);
      this._insertNode(copiedNode);
      this._updateCursorAfterPaste(copiedNode);
    },
    _initCopiedNode(copiedNode){
      copiedNode.place = this.cursor.place;
      copiedNode.path = this.cursor.path;
      if (copiedNode.children) {
        this._initChildrenOfCopiedNode(copiedNode, copiedNode.children);
      }
    },
    _initChildrenOfCopiedNode(parentNode, children, arrIndex){
      children.forEach((node, index) => {
        if (Array.isArray(node)) {
          this._initChildrenOfCopiedNode(parentNode, node, index);
        } else {
          node.place = parentNode.name === 'case' ? node.place : parentNode.name;
          node.path = arrIndex === undefined ? `${parentNode.path}-${index}` : `${parentNode.path}-${arrIndex}-${index}`;
          if (node.children) {
            this._initChildrenOfCopiedNode(node, node.children);
          }
        }
      })
    },
    addConstant(){
      if (!!this.constantValue) {
        this.editExpression({
          btn: {
            type: 'constant',
            renderType: 'tag',
            paramsType: 'constant',
            value: this.constantValue
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
    _initCursor(){
      return { path: '0', place: 'rootChildren'}
    },
    _initPrevCursor(node){
      //type主要用于前一个节点是数字用于合并
      if (node) {
        return {
          path: node.path,
          place: node.place,
          category: node.category
        }
      } else {
        return {path: null, place: null, category: null}
      }
    },
    _updateNodePath(node, updateType = 'insert'){
      // 插入或删除，找到此节点的父节点，判断同层有无其他节点，有则更新其他节点的path
      if (this.rootNode.children.length === 0) return;
      
      let parentNode = this._getParentNode(node);
      let nodeList = !!parentNode.children && parentNode.children || parentNode;
      let nodeAmount = nodeList.length; //node同层节点数2
      let nodeIndex = +node.path.split('-').pop(); // 插入节点索引
      if ( (nodeIndex === nodeAmount  && updateType === 'insert') || (nodeIndex === nodeAmount  && updateType === 'delete')) return;
      // this._walkUpdateNodePath({parentNode, startIndex: nodeIndex, updateType})
      // if (nodeIndex + 1 < nodeAmount) {
        this._updateNodePathRecursion( nodeList, nodeIndex, node.path.split('-').length - 1, updateType);
        // function recursion(nodeList, startIndex, pathIndex, updateType) {
        //   nodeList.some((node, index) => {
        //     // 从开始索引处更新后面节点path，path+1
        //     if (index >= startIndex) {
        //       if (Array.isArray(node)) {
        //         recursion(node, 0, pathIndex, updateType);
        //         return true;
        //       }
        //       let pathArr = node.path.split('-');
        //       if (updateType === 'insert') {
        //         pathArr[pathIndex] = String(+pathArr[pathIndex] + 1);
        //       } else if (updateType === 'delete') {
        //         pathArr[pathIndex] = String(+pathArr[pathIndex] - 1);
        //       }
        //       node.path = pathArr.join('-');
        //       if (node.children) {
        //         recursion(node.children, 0, pathIndex, updateType);
        //       }
        //     }
        //   })
        // }
      // }
    },
    _walkUpdateNodePath({ parentNode, startIndex, levelIndex, updateType}) {
      const nodeList = parentNode.children || parentNode; //删除、插入操作前的同层节点列表
      nodeList.some((node, index) => {
        if (index >= startIndex) {
          const parentNodePath = parentNode.path || '';
          let nodeIndex;
          if (updateType === 'insert') {
            nodeIndex = index + 1;
          } else if (updateType === 'delete') {
            nodeIndex = index - 1;
          }
          node.path = levelIndex === undefined ? `${parentNodePath}-${nodeIndex}` : `${parentNodePath}-${levelIndex}-${nodeIndex}`
        }
      })
    },
    _updateNodePathRecursion(nodeList, startIndex, pathIndex, updateType) {
      nodeList.some((node, index) => {
        // 从开始索引处更新后面节点path，path+1
        if (index >= startIndex) {
          if (Array.isArray(node)) {
            this._updateNodePathRecursion(node, 0, pathIndex, updateType);
            // return true;
          } else {
            let pathArr = node.path.split('-');
            if (updateType === 'insert') {
              pathArr[pathIndex] = String(+pathArr[pathIndex] + 1);
            } else if (updateType === 'delete') {
              pathArr[pathIndex] = String(+pathArr[pathIndex] - 1);
            }
            node.path = pathArr.join('-');
            if (node.children) {
              this._updateNodePathRecursion(node.children, 0, pathIndex, updateType);
            }
          }
        }
      })
    },

    _message(message, type){
      this.$message({
        message,
        type
      })
    },
    _getSameLevelNodeListOfCursor(){
      let cursorPathArr = this._getCursorPathArr();
      cursorPathArr.pop();
      let node = this.rootNode
      cursorPathArr.forEach(levelIndex => {
        node = node.children && node.children[levelIndex] || node[levelIndex];
      })
      return node.children && node.children || node;
    },
    _updateCursor(node) {
      if (node.renderType === 'text' || node.renderType === 'tag') {
        this.prevCursor = this._initPrevCursor(node);
        this.cursor.path = this._pathStepForward(node.path);
      } else if (node.renderType === 'fixedParams' || node.renderType === 'dynamicParams'){
        this.prevCursor = this._initPrevCursor();
        this.cursor.path = `${this.cursor.path}-0-0`;
        this.cursor.place = node.renderType;
      } else if (node.renderType === 'customParams') {
        this.prevCursor = this._initPrevCursor(node);
        this.cursor.path = this._pathStepForward(node.path);
        this.cursor.place = node.place;
      } else if (node.renderType === 'case'){
        this.prevCursor = this._initPrevCursor();
        this.cursor.path = `${this.cursor.path}-0-0`;
        this.cursor.place = 'caseCondition';
      }
    },

    _updateCursorAfterDelete(deletedNode) {
      if (deletedNode.path === '0') {
        // 删除的是最后一个节点，初始化光标；
        this.prevCursor = this._initPrevCursor();
        this.cursor = this._initCursor();
      } else {

        // 删除方法、if参数位置或case条件、默认值位置最后一个节点
        if ( 
        ( deletedNode.place === 'fixedParams' || 
          deletedNode.place === 'dynamicParams' || 
          deletedNode.place === 'caseCondition' || 
          deletedNode.place === 'caseDefaultValue'
        ) && deletedNode.path.slice(-1) === '0') {
          this.prevCursor = this._initPrevCursor();
          this.cursor.path = deletedNode.path;
          return;
        } else if (deletedNode.place === 'caseValue'){
          // 节点末位索引等于caseValue手节点的末尾索引 或者首位节点undefined（删除首位）初始化prevCursor
          // 否则prevCursor后退一步 cursor等于node。path
          const sameLevelNodeList = this._getSameLevelNodeListOfCursor();
          
          const sameLevelValueNodeList = sameLevelNodeList.filter(node => node.place === deletedNode.place);
          const firstValueNode = sameLevelValueNodeList[0];
          if (!firstValueNode || firstValueNode.path === deletedNode.path ) {
            this.prevCursor = this._initPrevCursor();
            this.cursor.path = deletedNode.path;
          } else {
            this.prevCursor.path = this._pathStepBack(deletedNode.path);
            this.cursor.path = deletedNode.path;
          }
        } else {
          this.prevCursor.path = this._pathStepBack(deletedNode.path);
          this.cursor.path = deletedNode.path;
        }
        console.log('delete this.cursor :>> ', this.cursor);
        console.log('delete this.prevCursor :>> ', this.prevCursor);
        
      }
    },
    _updateCursorAfterPaste(pasteNode) {
      this.prevCursor.path = pasteNode.path;
      this.prevCursor.category = pasteNode.category;
      this.prevCursor.place = pasteNode.category;
      this.cursor.path = this._pathStepForward(pasteNode.path);
      this.cursor.place = pasteNode.category;
    },
    _pathStepBack(path) {
      let pathArr = path.split('-');
      let last = +pathArr.pop();
      pathArr.push(String(last - 1));
      return pathArr.join('-');
    },
    _pathStepForward(path) {
      let pathArr = path.split('-');
      let last = +pathArr.pop();
      pathArr.push(String(last + 1));
      return pathArr.join('-');
    },
    // _getStructNodeList(targetNodeList, nodeType){
    //   return targetNodeList.filter(node => {
    //     return node.place === nodeType;
    //   })
    // },
    _getParentNode(opertedNode) {
      let pathArr = this._getCursorPathArr(opertedNode.path);
      pathArr.pop();

      let node = this.rootNode;
      if (pathArr.length === 0) return node;
      pathArr.forEach((pathIndex) => {
        node = node.children && node.children[pathIndex] || node[pathIndex];
      });
      return node;
    },
    _getCursorPathArr(cursorPath) {
      let path = cursorPath || this.cursor.path;
      return path.split('-');
    },

    _getInCursorNode(cursorPath){
      // 获取光标处的节点
      // 调用_getBeforeCursorNode方法，传参光标后一个位置的路径
      let afterCursorPath;
      if (this._getCursorPathArr().length === 1) {
        afterCursorPath = String(+this.cursor.path + 1);
      } else {
        let pathArr = this._getCursorPathArr();
        let last = +pathArr.pop() + 1;
        pathArr.push(String(last));
        afterCursorPath = pathArr.join('-');
      }
      return this._getBeforeCursorNode(afterCursorPath);
    },
    _getParentNodeOfThePath(cursorPath) {
      // 获取光标处父节点
      let cursorPathArr = this._getCursorPathArr(cursorPath);
      cursorPathArr.pop();
      let node = this.rootNode;
      // if (cursorPathArr.length === 0) return this.rootNode;
      cursorPathArr.forEach((nodeLevelIndex, index) => {
        node = node.children && node.children[nodeLevelIndex] || node[nodeLevelIndex];
      })
      return node;
    },
    _getBeforeCursorNode(cursorPath = this.cursor.path) {
      // 获取光标前的节点
      let cursorPathArr = cursorPath.split('-');
      let node = this.rootNode;
      if (cursorPathArr.length === 1) {
        return node.children[+cursorPath - 1]
      } else {
        cursorPathArr.some((cursorPathIndex, index) => {
          let paramsIndex = cursorPathIndex;
          if (cursorPathArr.length - 1 === index) {
            paramsIndex -= 1;
            // 光标在方法块中索引为0时，返回上一级节点；
            if (paramsIndex < 0 && index === cursorPathArr.length - 1) return true;
          }
          node = node.children && node.children[paramsIndex] || node[paramsIndex];
          // case语句块中，查询到组不存在返回；
          if (!node) return true;
        });
        return node;
      }
    },
    // 在光标处插入节点
    _insertNode(insertedNode){
      const cursorPathArr = this.cursor.path.split('-');
      const startIndex = +cursorPathArr.pop();
      const parentNode = this._getParentNodeOfThePath(this.cursor.path);
      const nodeList = parentNode.children && parentNode.children || parentNode;
      // 移动插入节点后面其他节点的位置
      // for(let index = nodeList.length; index >= startIndex; index--) {
      //   nodeList.splice(index, 1 , nodeList[index - 1]);
      // }
      // console.log('nodeList 2:>> ', deepCopy(nodeList) );
      // debugger
      nodeList.splice(startIndex, 0, insertedNode);
    },
    _triggerBtnOperate(parentNode, node, btn){
      if (this.cursor.path === null) return; //输入like节点时，cursor.path = null
      // 光标位置有节点，插入数字节点_insertNode()。否则新增push(node)
      if (this._getInCursorNode()) {
        // 1.先更新插入位置后其他节点的path
        // 2.插入节点
        this._updateNodePath(node);
        this._insertNode(node);
      } else {
        parentNode.children && parentNode.children.push(node) || parentNode.push(node);
      }
      // 更新光标
      // this.updateCursor(node);
      this._updateCursor(node);
    },
    _initNode(btn){
      const node = { ...btn };
      node.place = this.cursor.place;
      if (btn.renderType === 'fixedParams') {
        let paramAmount = btn.paramAmount;
        node.children = [];
        if (paramAmount === undefined) {
          node.children.push([]);
        } else {
          while (paramAmount) {
            node.children.push([]);
            paramAmount-- ;
          }
        }
      } else if (btn.renderType === 'dynamicParams'){
        node.children = [[],[]];
      } else if (btn.renderType === 'customParams'){
        node.children = [[{type: 'constant', renderType: 'constant', paramsType: 'constant', value: null, disabled: false, tooltipVisible: false}]];
      } else if (btn.renderType === 'case') {
        // 默认有when then和default，最后一个数组存default
        node.children = [[],[]];
      } else if (btn.renderType === 'text' && btn.category === 'digit') {
        node.value = btn.name;
      }
      node.path = this.cursor.path;

      return node;
    },
    _updateCaseNodesPathAfterDeleteWhenThen(nodes, level) {
      nodes.forEach((node, index) => {
        let pathArr = node.path.split('-');
        let oldLevel = pathArr[level];
        pathArr[level] = --oldLevel
        node.path = pathArr.join('-');
        if (node.children && node.children.length) {
          this._updateCaseNodesPathAfterDeleteWhenThen(nodes, level);
        }
      })
    },
    deleteCaseWhenThen({ caseNode, whenThenIndex }) {
      caseNode.children.splice(whenThenIndex, 1);
      const deletedWhenThenPath = `${caseNode.path}-${whenThenIndex}`;
      // 0-0-1
      // 0-0-0-0
      // 更新删除whenThen组之后节点的path
      caseNode.children.forEach((whenThenArr, index) => {
        if (index >= whenThenIndex) {
          this._updateCaseNodesPathAfterDeleteWhenThen(whenThenArr, caseNode.path.split('-').length);
        }
      })
      // 更新光标
      const deletedWhenThenPathDepth = deletedWhenThenPath.split('-').length;
      const sameDepthCursorIndex = +this.cursor.path.split('-')[deletedWhenThenPathDepth - 1];
      if (whenThenIndex === sameDepthCursorIndex) {
        if (whenThenIndex === 0) {
          this.prevCursor = this._initPrevCursor(caseNode);
          this.cursor.path = this._pathStepForward(caseNode.path);
          this.cursor.place = caseNode.place;
        } else {
          const prevWhenThenArr = caseNode.children[whenThenIndex - 1];
          const conditionNodeList = prevWhenThenArr.filter(node => node.place === 'caseCondition');
          const valueNodeList = prevWhenThenArr.filter(node => node.place === 'caseValue');
          if (valueNodeList.length === 0 ) {
            this.prevCursor = this._initPrevCursor();
            this.cursor.path = `${caseNode.path}-${whenThenIndex - 1}-${conditionNodeList.length}`;
            this.cursor.place = 'caseValue';
          } else {
            const lastValueNode = valueNodeList.slice(-1)[0];
            this.prevCursor = this._initPrevCursor(lastValueNode);
            this.cursor.path = this._pathStepForward(lastValueNode.path);
            this.cursor.place = lastValueNode.place;
          }
          // this.prevCursor.path = .slice(-1)[0].path;
        }
      } else if (whenThenIndex < sameDepthCursorIndex) {
        if (this.prevCursor.path) {
          const prevCursorArrIndex = this.prevCursor.path.slice(-3, -2);
          this.prevCursor.path = `${caseNode.path}-${prevCursorArrIndex - 1}-${this.prevCursor.path.slice(-1)}`;
        }
        const cursorArrIndex = this.cursor.path.slice(-3, -2);
        this.cursor.path = `${caseNode.path}-${cursorArrIndex - 1}-${this.cursor.path.slice(-1)}`
      }
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
      this.prevCursor.category = null;
      this.prevCursor.path = null;
      this.prevCursor.place = place;
      this.cursor.place = place;
      const parentNodePath = node.path;
      if(place === 'caseCondition' || place === 'caseDefaultValue'){
        this.cursor.path = `${parentNodePath}-${nodeListIndex}-0`;
      } else if (place === 'caseValue') {
        const sameLevelConditionNodeList = node.children[nodeListIndex].filter(node => node.place === 'caseCondition');
        const sameLevelConditionNodeLen = sameLevelConditionNodeList.length;
        // if (sameLevelConditionNodeLen === 0) {
        //   this.$message({
        //     message: '有条件未设置，不可新增！',
        //     type: 'info'
        //   })
        //   return ;
        // }
        this.cursor.path = `${parentNodePath}-${nodeListIndex}-${sameLevelConditionNodeLen}`;
      }
    },
    editParams({ node, paramsArrIndex, place}){
      let parentNodePath = node.path;
      this.prevCursor.path = null;
      this.prevCursor.category = null;
      this.prevCursor.place = place;
      this.cursor.path = `${parentNodePath}-${paramsArrIndex}-0`;
      this.cursor.place = place;
      if (node.renderType === 'dynamicParams') {
        if (node.children.filter(paramsArr => paramsArr.length === 0).length  <= 1){
          node.children.push([]);
        }
      }
    },
    editExpression({btn}) {
      if (!this.editable) return;
      // 输入常量时，cursor.path = null
      if (!this.cursor.path) return;
      let node = this._initNode(btn);
      

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
        && this.prevCursor.category === btn.category
        &&this.prevCursor.path.split('-').length === node.path.split('-').length) {
          // 光标前的节点类型和本次输入节点都是数字式，不做新增节点操作，更新光标前节点的值
          let path = this.prevCursor.path;
          // this._getBeforeCursorNode(this.cursor.path);
          this._getBeforeCursorNode();
          let beforeCursorNode = this._getBeforeCursorNode(this.cursor.path);
          let value = beforeCursorNode.value;
          beforeCursorNode.value = `${value}${btn.name}`; 
          // this.prevCursor = JSON.parse(JSON.stringify(this.cursor));
          // this.cursor = Object.assign(this.cursor, btn);
          // this.cursor = JSON.parse(JSON.stringify(this.prevCursor));
      }  else {
        this._triggerBtnOperate(parent, node, btn);
      }
    },
    // 根据cursor.path计算得到被删除节点的同层节点列表，然后根据被删除节点索引调用splice方法删除
    deleteNode() {
      if (this.prevCursor.path === null && this.prevCursor.place) {
        this._message('别删了，已经到头啦！', 'info');
        return;
      }
      let cursorPathArr = this._getCursorPathArr();
      let node = this.rootNode;
      cursorPathArr.some((cursorPathIndex, index) => {
        let deleteIndex;
          // 光标索引等于0，不能再删除；
        if (cursorPathArr.length - 1 === index) {
          // 在最里层，删除光标前一个节点
          deleteIndex = cursorPathIndex-1;
        }
        // 查找到删除索引后删除节点，否则继续取下一级节点
        if (deleteIndex !== undefined) {
          let nodeList = node.children && node.children || node;
          let deleteNode = nodeList[deleteIndex];
          let prevDelNode = nodeList[deleteIndex - 1];
          if (this.prevCursor.path === null) {
            this._message('别删了，到头啦！', 'info');
            return;
          } else {
            // 删除语句里节点，删除首位节点后面还有节点时，
            
            let delNode = nodeList.splice(deleteIndex, 1)[0];
            this._updateNodePath(delNode,'delete');
            this._updateCursorAfterDelete(delNode)
            
            return true;
          }
        } else {
          node = node.children && node.children[cursorPathIndex] || node[cursorPathIndex];
        }
      })
      if (this.rootNode.children.length === 0) {
        this.selectedNode = null;
      }
    },
    moveCursorToFirst(node) {
      console.log('moveCursorToFirst node :>> ', node);
      this.prevCursor = this._initPrevCursor();
      this.cursor.path = node.path;
      this.cursor.place = node.place;
    },
    /**
     * caret移动到首位
     * 可移动到首位的位置：rootChildren fixedParams dynamicParams caseCondition caseValue caseDefaultValue
     */
    moveStructCursorToFirst(parentNode, place, nodeArrIndex) {
      // let nodeList = parentNode.children && parentNode.children || parentNode[nodeArrIndex];
      if (place === 'rootChildren') {
        this.prevCursor = this._initPrevCursor();
        this.cursor = this._initCursor();
      } else if (place === 'fixedParams' || place === 'dynamicParams' || place === 'caseCondition' || place === 'caseDefaultValue') {
        this.prevCursor = this._initPrevCursor();
        // Object.assign(this.prevCursor, this._initPrevCursor())
        this.cursor.path = `${parentNode.path}-${nodeArrIndex}-0`;
        this.cursor.place = place;
      } else if (place === 'caseValue') {
        const sameLevelWhenThenArr = parentNode.children[nodeArrIndex];
        const sameLevelConditionNodeList = sameLevelWhenThenArr.filter(node => node.place === 'caseCondition');
        this.prevCursor = this._initPrevCursor();
        this.cursor.path = `${parentNode.path}-${nodeArrIndex}-${sameLevelConditionNodeList.length}`;
        this.cursor.place = place;
      }
    },
    moveCursor(node) {
      // console.log('moveCursor :>> ', node);
      // 点击node移动光标
      this.prevCursor = this._initPrevCursor(node);
      this.cursor.path = this._pathStepForward(node.path);
      this.cursor.place = node.place
    },
    setSelectedNode({node, selected}) {
      console.log('node, selected :>> ', node, selected);
      if (selected) {
        this.selectedNode = JSON.parse(JSON.stringify(node));
        // console.log('this.selectedNode :>> ', this.selectedNode);
      } else {
        this.selectedNode = null;
      }
    },
    increaseCaseWhenThen({
      node
    }) {
      const children = node.children;
      const lastWhenThenNodeList = children[children.length - 2];
      const hasCaseCondition = lastWhenThenNodeList.filter(node => node.place  === 'caseCondition').length;
      const hasCaseValue = lastWhenThenNodeList.filter(node => node.place  === 'caseValue').length;
      if ( !hasCaseCondition || !hasCaseValue){
        const noConditionMsg = !hasCaseCondition && '有条件未设置，不可新增！';
        const noValueMsg = !hasCaseValue && '有值未设置，不可新增！';
        this.$message({
          message: noConditionMsg || noValueMsg,
          type: 'info',
        });
      } else {
        node.children.splice(node.children.length-1, 0, []);
      
        // 更新光标位置
        this.prevCursor = this._initPrevCursor();
        this.cursor.path = `${node.path}-${node.children.length - 2}-0`;
        this.cursor.place = 'caseCondition';
        // 更新defaultValueNodeList path
        let defaultValueArr = node.children.slice(-1)[0];
        defaultValueArr.forEach((defaultValueNode, index) => {
          defaultValueNode.path = `${node.path}-${node.children.length - 1}-${index}`;
        })
      }
    },
    deleteCase(node) {
      // 点击【删除分支】按钮，光标可能在其他节点处，先移动光标到case节点后，在调用删除节点方法
      this.moveCursor(node);
      this.deleteNode()
    }
    
  }
}
</script>
<style lang="less" scoped>
.editor-btn-group{
  .el-button{
    margin-right: 5px;
    margin-bottom: 5px;
    &+ .el-button{
      margin-left: 0;
    }
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
</style>>