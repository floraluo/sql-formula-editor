import { defineStore } from 'pinia'
// import { config, manage, tagList } from '@/api/index'
import { useFieldStore } from '../dataSet/fieldStore'
import { SUCCESS_CODE } from '@/lib/constant'
import parseFormula from '@/utils/parseFormula.js'
// import checkFieldLegal from '@/utils/checkFieldLegal'



export const useModalFieldStore = defineStore('modalFieldStore', {
  state: () => {
    return {
      rootNode: {
        name: 'root',
        children: [] //公式的渲染模型
      },
      fieldConfigInfo: {}, //弹窗字段配置信息
      entityFieldConfigInfo: {},
      fieldIndex: null,
      originalField: null, //属性、指标弹窗字段原始信息
      formulaRenderModel: []
    }
  },
  actions: {
    async getFieldConfigInfo({ params, type }) {
      const fieldIndex = params.index;
      this.fieldIndex = params.index;
      delete params.index;
      const result = await manage.getFieldConfigInfo(params)
      if (result.code === SUCCESS_CODE) {
        this.fieldConfigInfo = {
          ...result.data,
          index: fieldIndex
        };
        
        if (type === 'attribute' || type === 'quota') {
          const fieldStore = useFieldStore();
          const formulaRenderModel = result.data.fieldConfig.nodes && parseFormula(result.data.fieldConfig.nodes, fieldStore.fieldList); 
          this.formulaRenderModel = result.data.fieldConfig.nodes && parseFormula(result.data.fieldConfig.nodes, fieldStore.fieldList);
          this.rootNode.children = formulaRenderModel;
        }
      }
      return result;
    },
    async updateFieldConfig({ params, type, sortFieldForm }) { 
      console.log('updateFieldConfig this.originalField :>> ', this.originalField);
      const result = await manage.updateFieldConfig(params);
      if (result.code === SUCCESS_CODE) {
        const fieldStore = useFieldStore();
        const field = {
          ...result.data,
          closable: this.originalField.closable,
          currentDS: this.originalField.currentDS,
          isNew: this.originalField.isNew,
          // isLegal: checkFieldLegal({fieldConfig: result.data.fieldConfig, fieldList: fieldStore.fieldList}),
        }
        if (type === 'attribute' || type === 'quota') { 
          field.nodes = this.rootNode.children;
          field.formulaRenderModel = parseFormula(result.data.fieldConfig.nodes, fieldStore.getFieldAreaList(type));
        }
        if (type === 'sortField') {
          field.groupFields = sortFieldForm.groupFields;
          field.sortFields = sortFieldForm.sortFields;
        }
        console.log('fieldStore.getFieldListByCategory[type] :>> ', fieldStore.getFieldListByCategory);
        fieldStore.getFieldListByCategory[type].splice(this.fieldIndex, 1, field);
      }
    },
    async saveFieldConfig({ params, type, sortFieldForm }) { 
      const result = await manage.saveFieldConfig(params);
      if (result.code === SUCCESS_CODE) {
        const fieldStore = useFieldStore();
        const field = {
          ...result.data,
          closable: true,
          currentDS: true,
          isNew: true,
          isLegal: true,
        }
        if (type === 'attribute' || type === 'quota') { 
          field.nodes = this.rootNode.children;
          field.formulaRenderModel = parseFormula(result.data.fieldConfig.nodes, fieldStore.getFieldAreaList(type));
        }
        if (type === 'sortField') {
          field.groupFields = sortFieldForm.groupFields;
          field.sortFields = sortFieldForm.sortFields;
        }
        fieldStore.getFieldListByCategory[type].push(field);
      }
    },
    async getEntityFieldConfigInfo(params) { 
      this.fieldIndex = params.index;
      delete params.index;
      const result = await manage.getFieldConfigInfo(params);
      if (result.code === SUCCESS_CODE) {
        this.fieldConfigInfo = {
          ...result.data,
          index: params.index
        };
      }
    }

  }
})