<template>
  <div ref="sqlTextCE" id="sqlTextCE"
    :contenteditable="editable"
    @keyup="handleCEKeyup"
    @keydown="handleCEKeydown"
    @blur="handleCEBlur"
    @click="handleCEClick"
    @input="handleCEInput"
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
    @mouseover="handleMouseover"
    @paste="paste"
    v-html="sqlHtml"></div>
</template>
<script>
import { deepCopy } from '@/lib/util'
import { 
  getTagHtml, 
  isFieldTag, 
  isSpaceTextNode,
  isMoveToLeftSelect, 
  isMoveToRightSelect,
  parseFormulaText,
  setDeleteTagSelection,
  fullSelectionTagRange,
  DIRECTION_RIGHT,
  DIRECTION_LEFT,
  isCursorBehindTag,
  isCursorBeforeTag,
  removeFocusFromTag,
  walkDomNodeListReplaceTag
} from './FormulaTextEditor_utils'

import { storeToRefs } from 'pinia'
import { useModalFieldStore } from '@/store/modal/modalFieldStore'
import { useFieldStore } from '@/store/dataSet/fieldStore';
import { useSqlTextEditorStore } from '@/store/modal/sqlTextEditor';
// const matchSearchStrReg = /(\b|[^a-zA-Z])[a-zA-Z]+$/;
const matchSearchStrReg = /[#]?[a-zA-Z\u4e00-\u9fa5]*$/;

export default {
  name: 'FormulaTextEditor',
  props: {
    sqlHtml: { type: String },
    type: { type: String }, // quota, attribute, field
    visible: { type: Boolean },
    editable: { type: Boolean, default: true},
    selectPanel: { type: Object}
  },
  watch: {
    visible: function(value) {
      if (!value) { // 弹窗关闭 把全局的事件解除了
        document.removeEventListener("keydown", this.documentKeyMethod)
        this.sqlTextEditorStore.$reset();
        
        //关闭弹窗清空contenteditable的内容。有输入时，sqlTextEditorStore中的sqlHtml清空了，contenteditable中的字节点不会清空
        this.$refs['sqlTextCE'].innerHTML = ''; 
      } else {
        document.addEventListener("keydown", this.documentKeyMethod)

        this.sqlTextEditorStore.component = this;
        this.sqlTextEditorStore.selection = window.getSelection();
      }
    },
    selectItemIndex (itemNum) {
      // if (itemNum !== 0) {
      //   this.$refs['sqlTextCE'].blur();
      // }
    }
  },
  components: {  },
  computed: {
    fieldAreaList() {
      return this.fieldStore.getFieldAreaList({
        fieldCategory: this.type,
      })
    },
    fieldList: function() {
      // return this.fieldAreaList.filter(field => field.fieldShowName.search(this.fieldKeyword) > -1)
      return this.fieldStore.getFieldAreaList({
        fieldCategory: this.type,
        filterFieldKeyword: this.fieldKeyword
      })
    },
    selectList: function() {
      const { selectPanelType } = this.sqlTextEditorStore;
      let selectList;
      if (selectPanelType === 'fieldList') {
        // const fieldList = this.fieldAreaList.filter(field => field.fieldShowName.search(this.fieldKeyword) > -1)
        const fieldList = this.fieldList;
        selectList = fieldList;

      } else if (selectPanelType === 'btnList') {
        // const funList = this.sqlTextEditorStore.getFunListWithFilter(this.type).filter(btn => {
        //   const { char, name } = btn;
        //   return char.search(this.fieldKeyword) > -1 || name.search(this.fieldKeyword) > -1
        // });
        // console.log('funList :>> ', funList);
        selectList = this.sqlTextEditorStore.getFunListWithFilter(this.type);
      }
      this.sqlTextEditorStore.selectList = selectList;
      this.sqlTextEditorStore.selectItemIndex = 0;
      // console.log('this.sqlTextEditorStore.selectList :>> ', this.sqlTextEditorStore.selectList);
      return selectList
    },
  },
  data() {
    const selection = window.getSelection ? window.getSelection() : document.selection

    return {
      enterShift: false,
      // selectPanelLeft: 0,
      selection,
      range: null,
      // startSearchRange: null,
      endSearchRange: null,
      selecting: false,
      startSelectX: null,
      endSelectX: null,
      selectDirection: {
        startX: 0,
        endX: 0
      },
      keydownIsDeleteTag: false,  //返回键的keydown事件是删除标签
      // lastEditRange: null,
      formulaText: '',
      // fieldKeyword: '',
      // formulaHtml: '',
      // selectItemIndex: 0, // # 所在的index
      insertChildIndex: 0 // 光标插入位置
    }
  },
  setup() {
    const fieldStore = useFieldStore();
    const modalFieldStore = useModalFieldStore();
    const { fieldConfigInfo, originalField } = storeToRefs(modalFieldStore);
    const sqlTextEditorStore = useSqlTextEditorStore();
    const { 
      showAutoSelectList,
      selectItemIndex,
      fieldKeyword,
      startSearchRange,
      lastEditRange,
      handleSelectItem,
    } = storeToRefs(sqlTextEditorStore);

    return {
      fieldStore,

      modalFieldStore,
      fieldConfigInfo,
      originalField,

      sqlTextEditorStore,
      showAutoSelectList,
      selectItemIndex,
      fieldKeyword,
      startSearchRange,
      lastEditRange,
      handleSelectItem,
    }
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy () { 
  },
  methods: {
    handleCEClick () {
      removeFocusFromTag(this.selection);
      this.range = this.selection.createRange ? this.selection.createRange() : this.selection.getRangeAt(0);
      // this._checkOpenSelectList(this.range);
    },
    
    handleCEBlur () {
      // this.sqlTextEditorStore.showAutoSelectList = false
    },
    _getPanelInfo () {
      // this.startSearchRange = this.selection.getRangeAt(0);
      const rangeDomRec = this.startSearchRange.getClientRects()[0]; //输入#符号的dom 
      const CEDomRec = this.$refs['sqlTextCE'].getBoundingClientRect(); //content editable dom
      const editorDomRec = this.$el.parentElement.getBoundingClientRect(); //输入sql的dom
      const editorDomScrollLeft = this.$el.parentElement.scrollLeft
      const calcPanelLeft = rangeDomRec.left - CEDomRec.left - editorDomScrollLeft;
      const calcPanelTop = rangeDomRec.top - editorDomRec.top + rangeDomRec.height;
      return {
        rangeDomRec,
        editorDomRec,
        calcPanelLeft,
        calcPanelTop
      }
    },

    setPanelPosition() {
      const { selectPanelType } = this.sqlTextEditorStore;
      const  {
        rangeDomRec,
        editorDomRec,
        calcPanelLeft,
        calcPanelTop
      } = this._getPanelInfo();
      this.sqlTextEditorStore.selectPanelLeft = calcPanelLeft

      const selectListLen = this.selectList.length;
      // const fieldListLen = this.fieldList.length;
      if (selectListLen > 3) {
        const panelHeight = selectListLen > 6 ? 210 : 30 * selectListLen
        this.sqlTextEditorStore.selectPanelTop = calcPanelTop - panelHeight - rangeDomRec.height;
      } else {
        this.sqlTextEditorStore.selectPanelTop = calcPanelTop;
      }
      
      setTimeout(() => {
        const panelRec = this.selectPanel.$el.getBoundingClientRect();
        const panelWidth = panelRec.width;
        const panelHeight = panelRec.height;
        if ( editorDomRec.width > calcPanelLeft + panelWidth) {
          this.sqlTextEditorStore.selectPanelLeft = calcPanelLeft
        } else {
          this.sqlTextEditorStore.selectPanelLeft = calcPanelLeft - panelWidth;
        }
        // if ( panelHeight + calcPanelTop > 180) {
        //   this.sqlTextEditorStore.selectPanelTop = calcPanelTop - panelHeight - rangeDomRec.height;
        // } else {
        //   this.sqlTextEditorStore.selectPanelTop = calcPanelTop;
        // }
        // this.sqlTextEditorStore.selectPanelTop = calcPanelTop - panelHeight - rangeDomRec.height;
          // this.sqlTextEditorStore.selectPanelTop = calcPanelTop;

      }, 0)
    },
    refreshPanelPosition() {
      const  {
        rangeDomRec,
        editorDomRec,
        calcPanelLeft,
        calcPanelTop
      } = this._getPanelInfo();
      const panelRec = this.selectPanel.$el.getBoundingClientRect();
        const panelWidth = panelRec.width;
        const panelHeight = panelRec.height;
        if ( editorDomRec.width > calcPanelLeft + panelWidth) {
          this.sqlTextEditorStore.selectPanelLeft = calcPanelLeft
        } else {
          this.sqlTextEditorStore.selectPanelLeft = calcPanelLeft - panelWidth;
        }
        if ( panelHeight + calcPanelTop > 180) {
          this.sqlTextEditorStore.selectPanelTop = calcPanelTop - panelHeight - rangeDomRec.height;
        } else {
          this.sqlTextEditorStore.selectPanelTop = calcPanelTop;
        }
    },
    
    handleMousedown(e) {
      // console.log('handleMousedown :>> ', e);
      this.selecting = true;
      this.selectDirection.startX= e.clientX;
    },
    handleMouseup(e) {
      this.selectDirection.endX = e.clientX;
      let direction;
      if (isMoveToRightSelect(this.selectDirection)) {
        direction = DIRECTION_RIGHT
      } else if (isMoveToLeftSelect(this.selectDirection)) {
        direction = DIRECTION_LEFT
      }
      fullSelectionTagRange(direction, this.selection);
      this.selecting = false;
    },
    paste(e) {
      e.preventDefault();
// console.log('pasete e :>> ',  e, e.clipboardData.getData('text/plain'));
    },
    handleMouseover(e) {
    },
    _getSearchStr(text) {
      const matchIndex = text.search(matchSearchStrReg);
      return {
        matchIndex,
        searchStr: matchIndex < 0 ? '' : text.substr(matchIndex)
      }
    },
    _hasSearchMarker(lastEditRange) {
      // const lastEditRange = this.selection.getRangeAt(0);
      const lastEditContainer = lastEditRange.startContainer;
      if (lastEditContainer.nodeName === '#text') {
        const textBeforeCursor = lastEditContainer.data.substr(0, lastEditRange.startOffset)
        const { searchStr, matchIndex } = this._getSearchStr(textBeforeCursor);
        const searchFieldMarkerIndex = searchStr.search('#');
        if (searchFieldMarkerIndex < 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    _hasSearchText(lastEditRange) {
      const lastEditContainer = lastEditRange.startContainer;
      if (lastEditContainer.nodeName === '#text') {
        const textBeforeCursor = lastEditContainer.data.substr(0, lastEditRange.startOffset)
        const searchStr = this._getSearchStr(textBeforeCursor).searchStr;
        const searchFieldMarkerIndex = searchStr.search('#');
        if (searchStr && searchFieldMarkerIndex < 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    handleCEInput() {
      this.lastEditRange = this.selection.getRangeAt(0);
      this._checkOpenSelectList(this.lastEditRange);
    },
    _checkOpenSelectList(lastRange) {
      this.lastEditRange = lastRange;
      const lastEditContainer = lastRange.startContainer;
      if (!lastEditContainer.data) {
        this.sqlTextEditorStore.showAutoSelectList = false;
        this.sqlTextEditorStore.selectItemIndex = 0;
        return;
      }
      const textBeforeCursor = lastEditContainer.data.substr(0, lastRange.startOffset)

      const { searchStr, matchIndex } = this._getSearchStr(textBeforeCursor);
      if (this._hasSearchMarker(lastRange)) {
        this.sqlTextEditorStore.selectPanelType = 'fieldList';
        const start = matchIndex + 1;
        // const start = lastEditContainer.data.search('#') + 1;
        const end = lastRange.startOffset;

        if (!this.sqlTextEditorStore.showAutoSelectList) {
          this.startSearchRange = lastRange.cloneRange();
          this.startSearchRange.setEnd(lastEditContainer, start);
        }

        const containerDOM = lastRange.commonAncestorContainer;
        // this.sqlTextEditorStore.fieldKeyword= containerDOM.data.substring(start, end);
        this.sqlTextEditorStore.fieldKeyword = searchStr.substr(1);
        this.sqlTextEditorStore.showAutoSelectList = true;
        if (this.fieldList.length === 0) {
          this.sqlTextEditorStore.showAutoSelectList = false;
          this.sqlTextEditorStore.selectItemIndex = 0;
          this.sqlTextEditorStore.fieldKeyword= '';
        }
        this.setPanelPosition();
      } else if (this._hasSearchText(lastRange)) {
        this.sqlTextEditorStore.selectPanelType = 'btnList';
        const firstIsChar = /^[^a-zA-Z]/.test(searchStr);
        // let start = firstIsChar ? (matchIndex + 1) : matchIndex;
        const start = matchIndex + 1;
        const end = lastRange.startOffset

        if (!this.sqlTextEditorStore.showAutoSelectList) {
          this.startSearchRange = lastRange.cloneRange();
          this.startSearchRange.setEnd(lastEditContainer, start);
        }

        this.sqlTextEditorStore.fieldKeyword = firstIsChar ? searchStr.substr(1) : searchStr;
        this.sqlTextEditorStore.showAutoSelectList = true;
        if (this.sqlTextEditorStore.getFunListWithFilter(this.type).length === 0) {
          this.sqlTextEditorStore.showAutoSelectList = false;
          this.sqlTextEditorStore.selectItemIndex = 0;
          this.sqlTextEditorStore.fieldKeyword= '';
        }
        this.setPanelPosition();
      } else {
        this.sqlTextEditorStore.showAutoSelectList = false;
        this.sqlTextEditorStore.selectItemIndex = 0;
      }
    },
    // handleKeyupDelete() {
    //   if (this.sqlTextEditorStore.showAutoSelectList) {
    //     const startRangeText = this.startSearchRange.endContainer.data;
    //     if (startRangeText === undefined) {
    //       this.sqlTextEditorStore.showAutoSelectList = false;
    //       return;
    //     }
    //     console.log('this.lastEditRange,  :>> ', this.lastEditRange, this.selection.getRangeAt(0));
    //     const textBeforeCursor = this.lastEditRange.startContainer.data.substr(0, this.lastEditRange.startOffset)
    //     const { searchStr, matchIndex } = this._getSearchStr(textBeforeCursor);
    //     // console.log('startRangeText.substr(this.startSearchRange.startOffset - 1, 1) :>> ', startRangeText);
    //     const searchMarker = startRangeText.substr(this.startSearchRange.startOffset - 1, 1)
    //     if ( searchMarker !== '#' ) { // 删除了#符号
    //       // this.sqlTextEditorStore.showAutoSelectList = false;
    //     } 
    //   }
    // },
    handleKeydownDelete() {
      this.keydownIsDeleteTag = false;
      if ( !this.sqlTextEditorStore.showAutoSelectList && this.selection.isCollapsed) {
        const currentFocusNode = this.selection.focusNode;
        const isTextNode = currentFocusNode.nodeName === '#text';
        const firstIsSpaceText = isTextNode && /^\s.*$/.test(currentFocusNode.data);
        const cursorBehindFirstChar = this.selection.focusOffset === 1;
        this.keydownIsDeleteTag = cursorBehindFirstChar && firstIsSpaceText && isFieldTag(currentFocusNode.previousSibling);
        if (this.keydownIsDeleteTag) {
          setDeleteTagSelection(this.selection);
        }
      }
    },
    
    handleKeyupRight(){
      this.handleCEInput();
      fullSelectionTagRange(DIRECTION_RIGHT, this.selection);
    },
    handleKeyupLeft(){
      this.handleCEInput();
      fullSelectionTagRange(DIRECTION_LEFT, this.selection);
    },
    handleKeydownRight() {
      if (this.selection.isCollapsed) {
        if (isCursorBeforeTag(this.selection)) {
          const range = this.selection.getRangeAt(0);
          const nextSiblingNode = range.endContainer.nextSibling;
          let startNode;
          if (isFieldTag(nextSiblingNode)) {
            startNode = nextSiblingNode.nextSibling; //标签节点后的空格文本节点
            range.setStart(startNode, 0); 
          } else if (isSpaceTextNode(nextSiblingNode)) {
            startNode = nextSiblingNode.nextSibling.nextSibling; //标签节点后的空格文本节点
          }
          if (startNode) {
            range.setStart(startNode, 0); 
            this.selection.addRange(range)
          } else {
            console.error("标签后缺失空格")
          }
        }
      }
    },
    handleKeydownLeft() {
      if (this.selection.isCollapsed) {
        if (isCursorBehindTag(this.selection)) {
          const range = this.selection.getRangeAt(0);
          const referenceNode = range.endContainer.previousSibling.previousSibling; //标签节点前的空格文本节点
          range.setEndAfter(referenceNode); 
          this.selection.addRange(range)
        }
      }
    },
    handleKeydownDown(e) {
      if(this.sqlTextEditorStore.showAutoSelectList) {
        e.preventDefault();
      }
    },
    handleCEKeyup (e) {
      const { key } = e;
      // console.log('keyup :>> ', key);
      this.searchMarkerMonitor(key);
      const keyupTriggerMap = new Map([
        // ["#", this.openFieldSelection],
        // ['Backspace', this.handleKeyupDelete],
        ['ArrowRight', this.handleKeyupRight],
        ['ArrowLeft', this.handleKeyupLeft],
        ['ArrowDown', this.handleKeydownDown],
      ])
      const triggerFunction = keyupTriggerMap.get(key);
      if (triggerFunction) {
        triggerFunction(e);
      }
    },
    handleCEKeydown(e) {
      const { key } = e;
      const keydownTriggerMap = new Map([
        ['Backspace', this.handleKeydownDelete],
        ['ArrowRight', this.handleKeydownRight],
        ['ArrowLeft', this.handleKeydownLeft],
        // ['ArrowDown', this.handleKeydownDown],
      ])
      const triggerFunction = keydownTriggerMap.get(key);
      if (triggerFunction) {
        triggerFunction(e)
        return;
      }
    },
    // 输入shift和3之间速度太快时，keyup事件监听不到#字符。但是输入框缺输入了#字符。
    // 增加监听器，手动监听两次按键之间过快不能触发#字符事件
    searchMarkerMonitor(key) {
      if (key === "Shift") {
        this.enterShift = true;
        setTimeout(() => {
          this.enterShift = false;
        }, 100)
      }
      // 100毫秒内先后输入了shift和3
      if (key === '3' && this.enterShift) {
        // this.openFieldSelection();
      }
    },
    
    // 获取消息内容的字符串
    getSqlText () {
      const sqlDomNode = this.$refs['sqlTextCE'].cloneNode(true);
      const domNodeList = sqlDomNode.childNodes;
      walkDomNodeListReplaceTag(domNodeList, this.fieldAreaList)
    
      return sqlDomNode.innerHTML
      .replace(/\"/g, '\'')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/<\/?br>/g, '\n').replace(/<\/?div>/g, '\n').replace(/\n+/g, '\n')
      .replace(/<\/?p>/g, ' ');
    },
    
    documentKeyMethod (e) {
      const UP = 38;
      const DOWN = 40;
      if (this.sqlTextEditorStore.showAutoSelectList) {
        if (e.keyCode === UP || e.keyCode === DOWN) {
          e.preventDefault();
          const scrollPanelDom = this.selectPanel.$el;
          const scrollTop = scrollPanelDom.scrollTop
          const selectItemHeight = 30;
          let index = this.sqlTextEditorStore.selectItemIndex
          const fieldCounts = this.selectList.length;
          const scrollPanelMaxItemNum = 7;
          if (e.keyCode === UP) { // 上键
            this.sqlTextEditorStore.selectItemIndex = (index - 1) < 0 ? 0 : index - 1;
            if (this.sqlTextEditorStore.selectItemIndex <= fieldCounts - scrollPanelMaxItemNum ) {
              const scrollTopMax = (this.sqlTextEditorStore.selectItemIndex - 1 ) * 30;
              if (scrollTop > scrollTopMax) {
                scrollPanelDom.scrollTop = scrollTopMax
              }
            }
          } else if (e.keyCode === DOWN) { // 到底之后 重新开始
            this.sqlTextEditorStore.selectItemIndex = (index + 1) > fieldCounts ? fieldCounts : index + 1;
            if (this.sqlTextEditorStore.selectItemIndex > scrollPanelMaxItemNum) {
              const scrollTopMin = selectItemHeight * (this.sqlTextEditorStore.selectItemIndex - scrollPanelMaxItemNum);
              if ( scrollTop < scrollTopMin) {
                scrollPanelDom.scrollTop = scrollTopMin;
              }
            }
          }
        } else if (e.keyCode === 13) { // 回车
          this.handleSelectItem(this.selectList[this.sqlTextEditorStore.selectItemIndex])
          e.preventDefault();
        }
      }
    }
  },
}
</script>
<style lang="less">
.CE-field{
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  position: relative;
  border: 1px solid;
  height: 20px;
  line-height: 18px;
  min-width: 32px;
  // max-width: 220px;
  border-radius: 2px;
  font-size: 12px;
  background-color: rgba(0,0,0,.06);
  color: rgba(0,0,0,.84);
  border-color: rgba(0,0,0,.06);
  // padding-left: 5px;
  // padding-right: 5px;
  &.CE-field-error{
    border-color: #f5483b;
    background-color: #f5483b;
    color: #fff;
  }
}
</style>