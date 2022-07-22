import { defineStore } from 'pinia'
import { config, manage, tagList } from '@/api/index'
import { SUCCESS_CODE, DATA_SET_BASE_TYPE, DATA_SET_CONFIG_TYPE  } from '@/lib/constant'
import enums from '@/lib/enums'
import parseTimeWindow from '@/utils/parseTimeWindow'
import parseFilterConditionConfig from '@/utils/parseFilterConditionConfig'
import { initBaseFilterConditionGroup } from '@/utils/CreateDS.js'
import { deepCopy } from '@/lib/util'

import { useFieldStore } from './fieldStore'
import parseDataSetDiffData from '@/utils/parseDataSetDiffData'


export const useDataSetStore = defineStore("dataSetStore", {
  state: () => {
    return {
      form: {},
      timeWindowList: [],
      filterCondition: initBaseFilterConditionGroup(),
      sourceFilterCondition: initBaseFilterConditionGroup(),
      targetFilterCondition: initBaseFilterConditionGroup(),
      diffStatus: null,
      tagOpts: [],
    };
  },
  
  actions: {
    setTimeWindowList(dataSetList, historyCalcEnable, diffType) {
      const timeWindowList = dataSetList.map(dataSet => {
        const timeWindow = {
          ...dataSet.timeWindow,
          alias: dataSet.alias,
          dataSetName: `${dataSet.name}[${dataSet.id}]`,
          timeDimType: dataSet.timeDimType,
        }
        return parseTimeWindow(timeWindow, historyCalcEnable)

      });
      
      const diffTypeMap = new Map([
        [undefined, () => this.timeWindowList = timeWindowList],
        ['source', () => this.sourceTimeWindowList = timeWindowList],
        ['target', () => this.targetTimeWindowList = timeWindowList],
      ])
      diffTypeMap.get(diffType)();
    },
    // 获取配置型数据集信息
    async queryConfigDataSet(params) {
      await this.getTagOpts();
      const result = await config.queryConfigDataSet(params);
      if (result.code === SUCCESS_CODE) {
        
        const page = result.data;
        const masterDS = page.dependentInfos[0];
        const masterDataSet = {
          alias: masterDS.alias,
          dataSetId: masterDS.id,
          dataSetName: `${masterDS.name}[${masterDS.id}]`,
          fieldList: masterDS.fieldList,
        }
        const slaveDSList = page.dependentInfos.slice(1);
        const slaveDataSetList = [];
        const joinInfoList = [];
        slaveDSList.forEach(slaveDS => {
          const slaveDataSet = {
            alias: slaveDS.alias,
            dataSetId: slaveDS.id,
            dataSetName: `${slaveDS.name}[${slaveDS.id}]`,
            fieldList: slaveDS.fieldList
          }
          slaveDataSetList.push(deepCopy(slaveDataSet)) 
          joinInfoList.push({
            alias: slaveDS.alias,
            joinType: slaveDS.joinType,
            timeDimType: slaveDS.timeDimType,
            slaveDataSet: deepCopy(slaveDataSet),
            masterDataSet: deepCopy(masterDataSet),
            joinConditionList: slaveDS.joinConditionList
            // joinConditionList: slaveDS.joinConditionList.map(condition => {
            //   return {
            //     master: {
            //       dataSetId: masterDS.id,
            //       alias: condition.masterAlias,
            //       fieldColumnName: condition.masterFieldColumnName,
            //       fieldShowName: condition.masterFieldName,
            //       // isLegal: true,
            //     },
            //     slave: {
            //       dataSetId: slaveDS.id,
            //       alias: condition.slaveAlias,
            //       fieldColumnName: condition.slaveFieldColumnName,
            //       fieldShowName: condition.slaveFieldName,
            //       // isLegal: true,
            //     }
            //   }
            // }),
          })
        })

        this.setTimeWindowList(page.dependentInfos, page.historyCalcEnable);

        
        const fieldStore = useFieldStore();
        fieldStore.setFieldList({
          dataSetList: page.dependentInfos,
          dataSetType: DATA_SET_CONFIG_TYPE
        });
        fieldStore.setEntityList({
          list: page.entityList,
          action: params.action
        })
        fieldStore.setQuotaList({ list: page.metricList });
        fieldStore.setAttributeList({ list: page.attributeList });
        fieldStore.setSortFieldList({ list: page.sortFieldList });
        
        const filterCondition = parseFilterConditionConfig(page.filterConfig, fieldStore.fieldList);

        const form = {
          ...page,
          masterDataSet,
          slaveDataSetList,
          joinInfoList,
          entityList: fieldStore.entityList,
          attributeList: fieldStore.attributeList,
          quotaList: fieldStore.quotaList,
          sortFieldList: fieldStore.sortFieldList,
          timeWindowList: this.timeWindowList,
          filterCondition
        }
        
        this.$patch({
          form,
          filterCondition
        })

      }
    },
    // 获取基础型数据集信息
    async queryBaseDataSet(params) {
      await this.getTagOpts();
      const result = await config.queryBaseDataSet(params);
      if ( result.code === SUCCESS_CODE ) {
        const page = result.data;

        const dataSource = {

        }
        
        const dataSet = {
          timeWindow: page.timeWindow,
          timeDimType: page.dependentDataSourcePartitionTimeType,
          alias: 'tw',
          name: page.dependentDataSourceName,
          id: page.dependentDataSourceId
        }
        this.setTimeWindowList([dataSet], page.historyCalcEnable);

        const fieldStore = useFieldStore();
        fieldStore.setFieldList({
          dataSourceFieldList: page.fieldList,
          dataSetType: DATA_SET_BASE_TYPE
        });
        fieldStore.setEntityList({
          list: page.entityList,
          action: params.action
        });
        fieldStore.setQuotaList({ list: page.metricList });
        fieldStore.setAttributeList({ list: page.attributeList });
        fieldStore.setSortFieldList({ list: page.sortFieldList });
        
        const filterCondition = parseFilterConditionConfig(page.filterConfig, fieldStore.fieldList);
        const form = {
          ...page,
          dataSource,
          entityList: fieldStore.entityList,
          attributeList: fieldStore.attributeList,
          quotaList: fieldStore.quotaList,
          sortFieldList: fieldStore.sortFieldList,
          timeWindowList: this.timeWindowList,
          filterCondition
        }
        this.$patch({
          form,
          filterCondition
        })
      }
    },
    // 获取标签列表
    async getTagOpts() {
      const result = await tagList.getTagList({
        pageNo: 1,
	      pageSize: 100000,
      })
      if (result.code === SUCCESS_CODE) {
        this.tagOpts = result.data.items;
      }
    },
    // 获取配置型数据集版本差异数据
    async getConfigDataSetDiff(params) { 
      
      // await this.getTagOpts();
      const result = await config.getConfigDataSetDiff(params);
      if (result.code === SUCCESS_CODE) {
        const { sourceDetail, targetDetail, sourceDiff, targetDiff } = result.data;
        
        const diffStatus = {
          source: parseDataSetDiffData(sourceDiff),
          target: parseDataSetDiffData(targetDiff),
        }
        const form = {
          sourceDetail,
          targetDetail,
          sourceMasterDataSet: sourceDetail.dependentInfos[0],
          targetMasterDataSet: targetDetail.dependentInfos[0],
          sourceSlaveDataSetList: sourceDetail.dependentInfos.slice(1),
          targetSlaveDataSetList: targetDetail.dependentInfos.slice(1),
        }
        this.setTimeWindowList(sourceDetail.dependentInfos, sourceDetail.historyCalcEnable, 'source');
        this.setTimeWindowList(targetDetail.dependentInfos, targetDetail.historyCalcEnable, 'target');

        const fieldStore = useFieldStore();
        const action = 'diff';
        this.setFieldStoreOnDiffAction({fieldStore, action, dataSet: sourceDetail, dataSetType: DATA_SET_CONFIG_TYPE, diffType: 'source'});
        this.setFieldStoreOnDiffAction({fieldStore, action, dataSet: targetDetail, dataSetType: DATA_SET_CONFIG_TYPE, diffType: 'target'});
        const sourceFilterCondition = parseFilterConditionConfig(sourceDetail.filterConfig, fieldStore.sourceFieldList);
        const targetFilterCondition = parseFilterConditionConfig(targetDetail.filterConfig, fieldStore.targetFieldList);
        this.$patch({
          form,
          sourceFilterCondition,
          targetFilterCondition,
          diffStatus
        })

      }
    },
    // 获取基础型数据集版本差异数据
    async getBaseDataSetDiff(params) {
      // await this.getTagOpts();
      const result = await config.getBaseDataSetDiff(params);
      if (result.code === SUCCESS_CODE) {
        const { sourceDetail, targetDetail, sourceDiff, targetDiff } = result.data;
        
        const diffStatus = {
          source: parseDataSetDiffData(sourceDiff),
          target: parseDataSetDiffData(targetDiff),
        }
        const form = {
          sourceDetail,
          targetDetail,
          sourceDataSource: `${sourceDetail.dependentDataSourceName}[${sourceDetail.dependentDataSourceId}]`,
          targetDataSource: `${targetDetail.dependentDataSourceName}[${targetDetail.dependentDataSourceId}]`,
        }
        const sourceDataSource = {
          timeWindow: sourceDetail.timeWindow,
          timeDimType: sourceDetail.dependentDataSourcePartitionTimeType,
          alias: 'tw',
          name: sourceDetail.dependentDataSourceName,
          id: sourceDetail.dependentDataSourceId
        }
        const targetDataSource = {
          timeWindow: targetDetail.timeWindow,
          timeDimType: targetDetail.dependentDataSourcePartitionTimeType,
          alias: 'tw',
          name: targetDetail.dependentDataSourceName,
          id: targetDetail.dependentDataSourceId
        }
        this.setTimeWindowList([sourceDataSource], sourceDetail.historyCalcEnable, 'source');
        this.setTimeWindowList([targetDataSource], targetDetail.historyCalcEnable, 'target');

        const fieldStore = useFieldStore();
        const action = 'diff';
        this.setFieldStoreOnDiffAction({fieldStore, action, dataSet: sourceDetail, dataSetType: DATA_SET_BASE_TYPE, diffType: 'source'});
        this.setFieldStoreOnDiffAction({fieldStore, action, dataSet: targetDetail, dataSetType: DATA_SET_BASE_TYPE, diffType: 'target'});
        const sourceFilterCondition = parseFilterConditionConfig(sourceDetail.filterConfig, fieldStore.sourceFieldList);
        const targetFilterCondition = parseFilterConditionConfig(targetDetail.filterConfig, fieldStore.targetFieldList);
        this.$patch({
          form,
          sourceFilterCondition,
          targetFilterCondition,
          diffStatus
        })
      }
    },
    // diffType: 'source' | 'target'(版本对比时需要)
    // action: 'edit' | 'view' (不同的动作，字段扩展不同属性)
    setFieldStoreOnDiffAction({ fieldStore, dataSet, dataSetType, action, diffType }) { 
      // let fieldList = dataSet.dependentInfos;
      // fieldList = fieldList || dataSet.fieldList;
      fieldStore.setFieldList({
        dataSetList: dataSet.dependentInfos, //配置型传数据集列表
        dataSourceFieldList: dataSet.fieldList, //基础型传字段列表
        dataSetType,
        diffType,
        action
      });
      fieldStore.setEntityListOnDiffAction({
        list: dataSet.entityList,
        dataSetType,
        diffType,
        action
      });
      fieldStore.setAttributeListOnDiffAction({
        list: dataSet.attributeList,
        diffType,
        action
      });
      fieldStore.setQuotaListOnDiffAction({
        list: dataSet.metricList,
        diffType,
        action
      });
      fieldStore.setSortFieldListOnDiffAction({
        list: dataSet.sortFieldList,
        dataSetType,
        diffType,
        action
      });
    },
  }
})