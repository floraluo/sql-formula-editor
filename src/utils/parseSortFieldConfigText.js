/**
 * 解析排序字段配置为文本
*/
export default function (fieldConfig) { 
  const SortTypeMap = {
    'asc': '升序',
    'desc': '降序'
  }
  const groupFieldConfigTextArray = fieldConfig.groupFields.map(groupField => {
    return groupField.fieldShowName;
  })
  const sortFieldConfigTextArray = fieldConfig.sortFields.map(sortField => {
    return `${sortField.fieldShowName} ${SortTypeMap[sortField.sortType]}`
  })
  const groupFieldConfigText = groupFieldConfigTextArray.join(',');
  const sortFieldConfigText = sortFieldConfigTextArray.join(',');
  return {
    groupFieldConfigText,
    sortFieldConfigText
  }
}