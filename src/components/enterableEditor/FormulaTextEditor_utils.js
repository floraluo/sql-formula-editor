import checkFieldLegal from '@/utils/checkFieldLegal'
export const DIRECTION_RIGHT = 'right';
export const DIRECTION_LEFT = 'left';

//输入模式公式，解析sqlText有<field></field>,获取field对应标签html结构
export function getTagHtml(field, tagText, fieldList, autoReplace) {
  const { type, dataSetAlias, dataSetId, dataSourceId, fieldColumnName, fieldDisplayName, fieldShowName, currentDS } = field;
  let isLegal;
  if (fieldList) { //有传入fieldList再验证合法
    if (type === 'self-field') {
      if (autoReplace) {
        const currentDSFieldList = fieldList.filter(field => field.currentDS);
        isLegal = currentDSFieldList.some(currentField => {
          const { fieldShowName, fieldColumnName} = currentField;
          return fieldColumnName === field.fieldColumnName && fieldShowName === field.fieldShowName
        })
      } else {
        isLegal = true;
      }
    } else {
      isLegal = checkFieldLegal({
        fieldConfig: {
          type: 'field',
          dataSetAlias,
          dataSetId: Number(dataSetId),
          dataSourceId: Number(dataSourceId),
          fieldColumnName,
          fieldDisplayName,
          fieldShowName
        },
        fieldList
      });
    }
  }
  const tagHtml = 
  `&nbsp;<span 
    class="CE-field ${isLegal === false ? 'CE-field-error' : ''}" 
    type="${type ? type : currentDS ? 'self-field' : 'field'}"
    dataSetAlias="${dataSetAlias ? dataSetAlias : ''}" 
    dataSetId="${dataSetId ? dataSetId : ''}" 
    dataSourceId="${dataSourceId ? dataSourceId : ''}" 
    fieldColumnName="${fieldColumnName}" 
    fieldDisplayName="${fieldDisplayName ? fieldDisplayName : ''}" 
    fieldShowName="${fieldShowName}" >
    &nbsp;${tagText}&nbsp;</span>&nbsp;`
  return tagHtml
}

export function isFieldTag(node) {
  return !!node && node.nodeName === 'SPAN' && node.classList.contains('CE-field');
}
export function isSpaceTextNode(node) {
  return !!node && node.nodeName === '#text' && /^\s$/.test(node.textContent);
}

export function isMoveToRightSelect(selectDirection) {
  return selectDirection.endX - selectDirection.startX > 0;
}
export function isMoveToLeftSelect(selectDirection) {
  return selectDirection.endX - selectDirection.startX < 0;
}

//遍历contenteditable的所有子节点，替换field标签
export function walkDomNodeListReplaceTag(domNodeList, fieldList) {
  domNodeList.forEach(node => {
    if (node.nodeName === 'SPAN') {
      // console.log('node SPAN:>> ', node.attributes);
      const attrMap = node.attributes;
      const tagText = node.innerText.trim()
      const field = fieldList.find(field => field.fieldDisplayName === tagText);
      // const { dataSetAlias, dataSetId, dataSourceId, fieldColumnName, fieldDisplayName, fieldShowName } = field;
      const fieldConfig = {
        type: attrMap.getNamedItem('type').value,
        dataSetId: attrMap.getNamedItem('datasetid').value,
        dataSetAlias: attrMap.getNamedItem('datasetalias').value,
        dataSourceId: attrMap.getNamedItem('datasourceid').value,
        fieldColumnName: attrMap.getNamedItem('fieldcolumnname').value,
        fieldShowName: attrMap.getNamedItem('fielddisplayname').value  || attrMap.getNamedItem('fieldshowname').value,
      }
      const tagHtml = `<field data='${JSON.stringify(fieldConfig)}'>${tagText}</field>`
      node.outerHTML = tagHtml
    } else if (node.nodeName === 'DIV') {
      walkDomNodeListReplaceTag(node.childNodes, fieldList)
    }
  })
}

// 解析消息内容的字符串
export function parseFormulaText(sqlText, fieldList, autoReplace = false) {
  if (!sqlText) return '';
  const formulaText = sqlText.replace(/\n/g, '<br>')
  const sqlDOM = new DOMParser().parseFromString(`<sql>${formulaText}</sql>`, 'text/html');
  const sqlDomRootNode = sqlDOM.getElementsByTagName('sql')[0]
  const sqlDomNodes = sqlDomRootNode.childNodes
  let html = '';
  sqlDomNodes.forEach(node => {
    if (node.nodeName === 'FIELD') {
      const field = JSON.parse(node.attributes.getNamedItem('data').value)
      const tagHtml = getTagHtml(field, node.innerHTML, fieldList, autoReplace);
      html += tagHtml
    } else if (node.nodeName === '#text') {
      html += node.data;
    } else {
      html += node.outerHTML;
    }
  })
  return html;
}

export function fullSelectionTagRange(direction, selection) {
  if (selection.type === 'Range') {
    let anchorNode = selection.anchorNode;
    let focusNode = selection.focusNode;
    let anchorOffset = selection.anchorOffset;
    let focusOffset = selection.focusOffset;
    const anchorNodeParent = anchorNode.parentNode;
    const focusNodeParent = focusNode.parentNode;
    if (isFieldTag(anchorNode.parentNode)) {
      if (direction === DIRECTION_RIGHT) {
        anchorNode = anchorNodeParent.previous3Sibling
        anchorOffset = anchorNode.textContent.length;
      } else if (direction === DIRECTION_LEFT) {
        anchorNode = anchorNodeParent.nextSibling
        anchorOffset = 0;
      }
    }
    // console.log('focusNode :>> ', focusNode);
    // console.log('focusNode.parentNode :>> ', focusNode.parentNode);
    
    if (isFieldTag(focusNode.parentNode)) {
      if (direction === DIRECTION_RIGHT) {
        focusNode = focusNodeParent.nextSibling
        focusOffset = 0;
      } else if (direction === DIRECTION_LEFT) {
        focusNode = focusNodeParent.previousSibling
        focusOffset = focusNode.textContent.length;
      }
    }
    selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  }
}

// 是紧跟标签后的光标
export function isCursorBehindTag(selection) {
  const currentFocusNode = selection.focusNode; //光标处的节点
  const isTextNode = currentFocusNode.nodeName === '#text';   //光标处是文本节点
  const firstIsSpaceText = isTextNode && /^\s(.|[\u4e00-\u9fa5])*$/.test(currentFocusNode.data);  //光标处是文本节点时，此文本节点首位字符是空格
  const cursorBehindFirstChar = selection.focusOffset === 1;  //光标偏移一个字符

  const isCursorBehindTag = cursorBehindFirstChar && firstIsSpaceText && isFieldTag(currentFocusNode.previousSibling);
  return isCursorBehindTag;
}

// 是标签前的光标
export function isCursorBeforeTag(selection) {
  const currentFocusNode = selection.focusNode; //光标处的节点
  const isTextNode = currentFocusNode.nodeName === '#text'; //光标处是文本节点
  const textContent = currentFocusNode.textContent;
  
  const nextSiblingNode = currentFocusNode.nextSibling; //光标处节点的后兄弟节点

  let isCursorBeforeTag = false;
  if (isFieldTag(nextSiblingNode)) {  //光标后兄弟节点是标签
    //光标处是文本节点时，此文本节点末位字符是空格
    const lastIsSpaceText = isTextNode && /^(.|[\u4e00-\u9fa5])*\s$/.test(textContent);
    const textNodeData = currentFocusNode.textContent;
    const cursorBehindFirstChar = selection.focusOffset == textNodeData.length - 1;  //光标偏移倒数一个字符
    isCursorBeforeTag = cursorBehindFirstChar && lastIsSpaceText;
  } else if (isSpaceTextNode(nextSiblingNode)) { // 光标后兄弟节点是单个空格文本节点
    const cursorAtEnd = selection.focusOffset === currentFocusNode.textContent.length;
    isCursorBeforeTag = cursorAtEnd
  }
  // console.log('isCursorBeforeTag :>> ', isCursorBeforeTag);
  
  return isCursorBeforeTag;
}

//设置删除标签的范围，光标在标签后面
export function setDeleteTagSelection(selection) {
  const anchorNode = selection.anchorNode.previousSibling.previousSibling;
  const focusNode = selection.anchorNode;
  let anchorOffset;
  const focusOffset = 1;
  if (isSpaceTextNode(anchorNode)) {
    anchorOffset = 0;
  } else {
    anchorOffset = anchorNode.textContent.length - 1;
  }
  selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
}

//光标从标签上移开
export function removeFocusFromTag(selection) {
  const range = selection.getRangeAt(0);
  
  if (selection.isCollapsed) { //选区折叠时，点击标签
    const anchorParentNode = selection.anchorNode.parentNode;
    const anchorNextSiblingNode = selection.anchorNode.nextSibling;
    //点击在标签上
    if (isFieldTag(anchorParentNode)) {
      const fieldTagNode = anchorParentNode;
      const anchorOffset = selection.anchorOffset;
      const textLength = fieldTagNode.textContent.length;
      
      if (textLength / 2 < anchorOffset) {
        range.setStart(fieldTagNode.nextSibling, 1);
        range.collapse(false);
      } else {
        range.setEnd(fieldTagNode.previousSibling, fieldTagNode.previousSibling.textContent.length - 1);
        range.collapse(true);
      }
    } else if (isFieldTag(anchorNextSiblingNode)) { //点击在标签前
      const anchorNode = selection.anchorNode;
      if (anchorNode.textContent.length === selection.anchorOffset) {
        range.setEnd(anchorNode, anchorNode.textContent.length - 1)
      }
    }
    selection.addRange(range);
    
  }
}