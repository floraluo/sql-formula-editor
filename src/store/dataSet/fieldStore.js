import { defineStore } from 'pinia'
import enums from '@/lib/enums'
import parseFormula from '@/utils/parseFormula'
// import checkFieldLegal from '@/utils/checkFieldLegal';
import { DATA_SET_BASE_TYPE, DATA_SET_CONFIG_TYPE } from '@/lib/constant'

const fieldTypeMap = {};
enums.fieldType.forEach(item => {
  fieldTypeMap[item.value] = item.label
})

export const useFieldStore = defineStore('dataSetFieldStore', {
  state: () => {
    return { 
      fieldList: [],          // 上游数据源｜数据集的所有字段列表
      entityList: [],         // 粒度列表
      attributeList: [],      // 属性列表
      quotaList: [],          // 指标列表
      sortFieldList: [],      // 排序字段列表
      usingFieldArr: [],
      recoverField:null,
    }
  },
  getters: {
    getFieldListByCategory: (state) => { 
      return {
        entity: state.entityList,
        attribute: state.attributeList,
        quota: state.quotaList,
        sortField: state.sortFieldList,
      }
    },
    getFieldAreaList: (state) => {
      return (fieldCategory) => {
        const fieldCategoryMap = {
          'quota': state.quotaList,
          'attribute': state.attributeList,
          'field': []
        }
        const fieldList = state.fieldList;
        return fieldList.concat(fieldCategoryMap[fieldCategory]);
      }
    },
    getFieldInfoList: (state) => {
      const setDataMap = new Map([
        [undefined, { entity: 'entityList', attribute: 'attributeList', quota: 'quotaList', sortField: 'sortFieldList' }],
        ['source', { entity: 'sourceEntityList', attribute: 'sourceAttributeList', quota: 'sourceQuotaList', sortField: 'sourceSortFieldList' }],
        ['target', { entity: 'targetEntityList', attribute: 'targetAttributeList', quota: 'targetQuotaList', sortField: 'targetSortFieldList' }],
      ])
      // const fieldInfoList = [];
      
      // fieldInfoList.push({
      //   type: 'entity',
      //   name: '粒度',
      //   data: state.entityList
      // })
      // fieldInfoList.push({
      //   type: 'attribute',
      //   name: '属性',
      //   data: state.attributeList
      // })
      // fieldInfoList.push({
      //   type: 'quota',
      //   name: '指标',
      //   data: state.quotaList
      // })
      // fieldInfoList.push({
      //   type: 'sortField',
      //   name: '排序字段',
      //   data: state.sortFieldList
      // })
      // return fieldInfoList
      // console.log('state[setDataMap.get(diffType).entity] :>> ', state[setDataMap.get().entity]);
      return (diffType) => {
        const fieldInfoList = [];
      
        fieldInfoList.push({
          type: 'entity',
          name: '粒度',
          data: state[setDataMap.get(diffType).entity]
        })
        fieldInfoList.push({
          type: 'attribute',
          name: '属性',
          data: state[setDataMap.get(diffType).attribute]
        })
        fieldInfoList.push({
          type: 'quota',
          name: '指标',
          data: state[setDataMap.get(diffType).quota]
        })
        fieldInfoList.push({
          type: 'sortField',
          name: '排序字段',
          data: state[setDataMap.get(diffType).sortField]
        })
        return fieldInfoList

      }
    },
  },
  actions: {
    setField(fieldCategory, parsedList, diffType) { 
      const type = `${fieldCategory}|${diffType}`
      const diffTypeMap = new Map([
        ['fieldList|undefined', () => this.fieldList = parsedList],
        ['fieldList|source', () => this.sourceFieldList = parsedList],
        ['fieldList|target', () => this.targetFieldList = parsedList],
        ['entityList|undefined', () => this.entityList = parsedList],
        ['entityList|source', () => this.sourceEntityList = parsedList],
        ['entityList|target', () => this.targetEntityList = parsedList],
        ['attributeList|undefined', () => this.attributeList = parsedList],
        ['attributeList|source', () => this.sourceAttributeList = parsedList],
        ['attributeList|target', () => this.targetAttributeList = parsedList],
        ['quotaList|undefined', () => this.quotaList = parsedList],
        ['quotaList|source', () => this.sourceQuotaList = parsedList],
        ['quotaList|target', () => this.targetQuotaList = parsedList],
        ['sortFieldList|undefined', () => this.sortFieldList = parsedList],
        ['sortFieldList|source', () => this.sourceSortFieldList = parsedList],
        ['sortFieldList|target', () => this.targetSortFieldList = parsedList],
      ]);
      diffTypeMap.get(type)();
    },
    setFieldList({ dataSetList, dataSourceFieldList, dataSetType, diffType }) {
      const fieldList = [];
      const handleFieldListMethodMap = {
        [DATA_SET_CONFIG_TYPE]: () => {
          dataSetList.forEach(dataSet => {
            const list = dataSet.fieldList.map(field => {
              return {
                ...field,
                fieldDisplayName: `${dataSet.alias}_${field.dataSetId}_${field.fieldShowName}`,
                fieldShowNameOrigin: field.fieldShowName,
                dataSetAlias: dataSet.alias,
                id: `${dataSet.alias}_${field.dataSetId}_${field.fieldColumnName}`,
              }
            })
            fieldList.push(...list);
          })
        },
        [DATA_SET_BASE_TYPE]: () => { 
          dataSourceFieldList.forEach(field => {
            const finalField = {
              ...field,
              fieldDisplayName: `${field.dataSourceId}_${field.fieldShowName}`,
              fieldShowNameOrigin: field.fieldShowName,
              id: `${field.dataSourceId}_${field.fieldColumnName}`,
            }
            fieldList.push(finalField);
          })
        }
      }
      handleFieldListMethodMap[dataSetType]();
      this.setField('fieldList', fieldList, diffType);
    },
    setEntityList({ list, dataSetType, action }) { 
      this.entityList = list.map(field => {
        return {
          ...field, closable: action === "copy", currentDS: true, isNew:false, 
          // isLegal: checkFieldLegal({fieldConfig: field.fieldConfig, fieldList: this.fieldList}) 
        };
      })
    },
    setQuotaList({list}) { 
      this.quotaList = list.map(field => {
        const formulaRenderModel = parseFormula(field.fieldConfig.nodes, this.fieldList);
        const fieldConfig = {
          type: 'nodeList',
          nodes: formulaRenderModel
        }
        return {
          ...field, closable: true, currentDS: true, isNew:false, 
          // isLegal: checkFieldLegal({fieldConfig, fieldList: this.fieldList}), 
          formulaRenderModel
        }
      })
    },
    setAttributeList({ list }) { 
      this.attributeList = list.map(field => {
        const formulaRenderModel = parseFormula(field.fieldConfig.nodes, this.fieldList);
        const fieldConfig = {
          type: 'nodeList',
          nodes: formulaRenderModel
        }
        return {
          ...field, closable: true, currentDS: true, isNew:false, 
          // isLegal: checkFieldLegal({fieldConfig, fieldList: this.fieldList}), 
          formulaRenderModel
        }
      })
    },
    setSortFieldList({ list }) { 
      this.sortFieldList = list.map(field => {
        return {
          ...field, closable: true, currentDS: true, isNew:false, 
          // isLegal: checkFieldLegal({fieldConfig: field.fieldConfig, fieldList: this.fieldList})
        }
      })
    },

    setEntityListOnDiffAction({ list, dataSetType, diffType }) {
      const fieldConfigTextMapByDataSetType = {
        [DATA_SET_BASE_TYPE]: (field) => {
          return field.fieldConfig.fieldShowName
          // return field.fieldConfig.dataSourceId ? `${field.fieldConfig.dataSourceId}_${field.fieldShowName}` : field.fieldShowName;
        },
        [DATA_SET_CONFIG_TYPE]: (field) => {
          return field.fieldConfig.fieldShowName
          // return `${field.fieldConfig.dataSetAlias}_${field.fieldConfig.dataSetId}_${field.fieldShowName}`;
        }
      }
      const entityList = list.map(field => {
        return {
          ...field,
          fieldConfigText: fieldConfigTextMapByDataSetType[dataSetType](field),
          fieldTypeName: fieldTypeMap[field.fieldType]
        }
      })
      this.setField('entityList', entityList, diffType);
    },
    setAttributeListOnDiffAction({ list, diffType }) {
      const attributeList = list.map(field => {
        return {
          ...field,
          fieldTypeName: fieldTypeMap[field.fieldType],
          formulaRenderModel: parseFormula(field.fieldConfig.nodes)
        }
      })
      this.setField('attributeList', attributeList, diffType);
    },
    setQuotaListOnDiffAction({ list, diffType }) {
      const quotaList = list.map(field => {
        return {
          ...field,
          fieldTypeName: fieldTypeMap[field.fieldType],
          formulaRenderModel: parseFormula(field.fieldConfig.nodes)
        }
      })
      this.setField('quotaList', quotaList, diffType);
    },
    setSortFieldListOnDiffAction({ list, dataSetType, diffType }) {
      const SortTypeMap = {
        'asc': '升序',
        'desc': '降序'
      }
      const sortFieldList = list.map(field => {
        const groupFieldConfigTextArray = field.fieldConfig.groupFields.map(groupField => {
          // let fieldConfigText;
          // if (dataSetType === DATA_SET_BASE_TYPE) {
          //   fieldConfigText = groupField.fieldShowName;
          // } else if (dataSetType === DATA_SET_CONFIG_TYPE) {
          //   fieldConfigText = groupField.fieldShowName;
          // }
          // return fieldConfigText
          return groupField.fieldShowName;
        })
        const sortFieldConfigTextArray = field.fieldConfig.sortFields.map(sortField => {
          return `${sortField.fieldShowName} ${SortTypeMap[sortField.sortType]}`
        })
        const groupFieldConfigText = groupFieldConfigTextArray.join(',');
        const sortFieldConfigText = sortFieldConfigTextArray.join(',');
        return {
          ...field,
          fieldTypeName: fieldTypeMap[field.fieldType],
          fieldConfigText: `分组：${groupFieldConfigText}  排序：${sortFieldConfigText}`,
          groupFieldConfigText,
          sortFieldConfigText,
        }
      })
      this.setField('sortFieldList', sortFieldList, diffType);
    },
    changeUsingFieldArr(result){
      this.usingFieldArr = result
    }
  }
})