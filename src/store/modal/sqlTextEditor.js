import { defineStore } from 'pinia'
import editSqlTextSelectList from '@/lib/editSqlTextSelectList'

import { 
  getTagHtml
} from '@/components/enterableEditor/FormulaTextEditor_utils'
export const useSqlTextEditorStore = defineStore('sqlTextEditorStore', {
  state: () => {
    return {
      $refs: {},
      sqlHtml: '',
      showAutoSelectList: false,

      enterShift: false,
      selectPanelLeft: 0,
      selectPanelTop: 0,
      selection: window.getSelection(),
      range: null,
      startSearchRange: null,
      lastEditRange: null,
      endSearchRange: null,
      selecting: false,
      startSelectX: null,
      endSelectX: null,
      selectDirection: {
        startX: 0,
        endX: 0
      },
      keydownIsDeleteTag: false,  //返回键的keydown事件是删除标签
      formulaText: '',
      fieldKeyword: '',
      formulaHtml: '',
      selectItemIndex: 0, // # 所在的index
      insertChildIndex: 0, // 光标插入位置
      fieldList: [],
      selectList: [],
      selectPanelType: '', // fieldList, btnList
      component: null,
    }
  },
  getters: {
    //获取按键方法列表
    getFunListWithFilter(state) {
      return (type) => {
        const funList = editSqlTextSelectList
        return funList.filter(item => {
          const { name } = item;
          return name.search(state.fieldKeyword) === 0
        });
      }
      
    }
  },
  actions: {
    insertField(item) { 
      const tagText = item.fieldDisplayName || item.fieldShowName
      const dom = new DOMParser().parseFromString(getTagHtml(item, tagText, this.fieldAreaList), 'text/html')
      const node = dom.getElementsByTagName('span')[0]

      if (this.selection.rangeCount > 0) {
        const anchorNode = this.startSearchRange.startContainer;
        const anchorOffset = this.startSearchRange.startOffset - 1;
        const focusNode = this.lastEditRange.startContainer;
        const focusOffset = this.lastEditRange.startOffset;
        this.selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        this.selection.deleteFromDocument();  //删除#字符
        const range = this.selection.getRangeAt(0)

        const fragment = new DocumentFragment();  //创建标签节点片段
        if (range.startContainer.nodeName === '#text' ) {
          if (range.startContainer.data === '') { //光标处是空文本，标签前后插入空格
            fragment.append(new Text('\xA0'))
            fragment.append(node)
            fragment.append(document.createTextNode("\xA0")); // \u200b
            range.insertNode(fragment) // 设置选择范围的内容为插入的内容
            this.selection.collapse(range.endContainer.childNodes[range.endOffset - 1], 1);
          } else if (range.startOffset === 0) { //光标在文本首位，先修改文本首位加空格字符。然后标签前插入空格
            range.startContainer.data = ' ' + range.startContainer.data
            fragment.append(new Text('\xA0'))
            fragment.append(node)
            range.insertNode(fragment) // 设置选择范围的内容为插入的内容
            this.selection.collapse(range.endContainer.childNodes[range.endOffset], 1);
          } else if (range.startOffset === range.startContainer.length) { //光标在文本末尾，先标签后插入空格。然后修改文本，末尾加空格字符
            fragment.append(node)
            fragment.append(new Text('\xA0'))
            range.insertNode(fragment) // 设置选择范围的内容为插入的内容
            if (range.startContainer.data.slice(-1) !== ' ') {
              range.startContainer.data = range.startContainer.data + ' ';
            }
            this.selection.collapse(range.endContainer.childNodes[range.endOffset - 1], 1);
          } else { //光标在文本中间。插入标签后文本被分割两个文本节点。先光标前的文本节点末尾增加空格字符。然后标签后的文本节点首位增加空格字符。
            fragment.append(node)
            range.insertNode(fragment) // 设置选择范围的内容为插入的内容
            range.startContainer.data = range.startContainer.data + ' ';
            const textNode = range.startContainer.nextSibling.nextSibling;
            textNode.data = ' ' + textNode.data;
            this.selection.collapse(range.endContainer.childNodes[range.endOffset], 1);
          }
        }

      }
    },
    insertMethodText(item) { 
      const funName = item.name;
      const anchorNode = this.startSearchRange.startContainer;
      const anchorOffset = this.startSearchRange.startOffset - 1;
      const focusNode = this.lastEditRange.startContainer;
      const focusOffset = this.lastEditRange.startOffset;
      this.selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      this.selection.deleteFromDocument();  //删除#字符
      const range = this.selection.getRangeAt(0)

      const fragment = new DocumentFragment();  //创建标签节点片段
      if (range.startContainer.nodeName === '#text' ) {
        range.insertNode(new Text(`${funName}(\xA0\xA0)`)) // 设置选择范围的内容为插入的内容
        this.selection.collapse(range.endContainer.childNodes[range.endOffset - 1], funName.length + 2);
      }
    },
    insertCaseText(item) { 
      const funName = item.name;
      const anchorNode = this.startSearchRange.startContainer;
      const anchorOffset = this.startSearchRange.startOffset - 1;
      const focusNode = this.lastEditRange.startContainer;
      const focusOffset = this.lastEditRange.startOffset;
      this.selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      this.selection.deleteFromDocument();  //删除#字符
      const range = this.selection.getRangeAt(0)

      const fragment = new DocumentFragment();  //创建标签节点片段
      if (range.startContainer.nodeName === '#text') {
        const brNode = document.createElement('br')
        fragment.append(new Text('case'))
        fragment.append(document.createElement('br'))
        fragment.append(new Text('when\xA0\xA0then '))
        fragment.append(document.createElement('br'))
        fragment.append(new Text('else '))
        fragment.append(document.createElement('br'))
        fragment.append(new Text('end'))
        range.insertNode(fragment)
        const whenThenTextNode = range.endContainer.childNodes[range.endOffset - 5]
        this.selection.collapse(whenThenTextNode, 5);
      }
    },
    insertText(item) { 
      const anchorNode = this.startSearchRange.startContainer;
      const anchorOffset = this.startSearchRange.startOffset - 1;
      const focusNode = this.lastEditRange.startContainer;
      const focusOffset = this.lastEditRange.startOffset;
      this.selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      this.selection.deleteFromDocument();  //删除#字符
      const range = this.selection.getRangeAt(0)

      if (range.startContainer.nodeName === '#text') {
        range.insertNode(new Text(item.showName))
        this.selection.collapse(range.endContainer.childNodes[range.endOffset - 1], item.showName.length);
      }
    },
    handleSelectItem (item) {
      if (item.fieldColumnName) {
        this.insertField(item);
      } else {
        this.insertText(item)
      }
      this.showAutoSelectList = false;
      this.selectItemIndex = 0;
      this.fieldKeyword= '';
    },
  }
})