import { defineStore } from 'pinia'
// import { config, manage, tagList } from '@/api/index'
import { useFieldStore } from '@/store/dataSet/fieldStore'
import { useSqlTextEditorStore } from '@/store/modal/sqlTextEditor'
import { SUCCESS_CODE } from '@/lib/constant'
import parseFormula from '@/utils/parseFormula.js'
import { parseFormulaText } from '@/components/enterableEditor/FormulaTextEditor_utils'
import parseSortFieldConfigText from '@/utils/parseSortFieldConfigText'
import { setRenderModel } from '@/utils/CreateDS.js'
import checkFieldLegal from '@/utils/checkFieldLegal'
import Node from '@/components/editor/Node.js'

const rootNodeOpt = {
  name: 'root',
  renderType: 'root'
}
const rootNode = new Node({ opt: rootNodeOpt })

export const useModalFieldStore = defineStore('modalFieldStore', {
  state: () => {
    rootNode.children.splice(0)
    
    return {
      // rootNode: {
      //   name: 'root',
      //   children: [] //公式的渲染模型
      // },
      formulaText: '',
      rootNode: rootNode,
      fieldConfigInfo: {}, //弹窗字段配置信息
      entityFieldConfigInfo: {},
      fieldIndex: null,
      originalField: null, //属性、指标弹窗字段原始信息
      formulaRenderModel: [],

      modalType: '',
      fieldAreaList: [],

      
      
    }
  },
  actions: {
    setFieldConfigInfo({ field, index }) { 
      this.fieldConfigInfo = {
        ...field,
        index
      };
    },
    setRootNode({nodes, sqlText}) { 
      const fieldStore = useFieldStore();
      const { fieldList } = fieldStore;
      // const { nodes, sqlText } = result.data.fieldConfig;
      if (nodes) {
        const formulaRenderModel = parseFormula(nodes, fieldList); 
        this.formulaRenderModel = formulaRenderModel;
        this.rootNode.children = formulaRenderModel;
      } else if (sqlText) {
        const sqlTextEditorStore = useSqlTextEditorStore();
        sqlTextEditorStore.sqlHtml = parseFormulaText(sqlText, fieldList);
      }
    },
    //update接口检测字段合法性
    async updateFieldConfig({ params, type, sortFieldForm }) { 
      const result = await manage.updateFieldConfig(params);
      if (result.code === SUCCESS_CODE) {
        const fieldStore = useFieldStore();
        const { fieldConfig } = result.data;
        const field = {
          ...result.data,
          deleted: false,
          closable: this.originalField.closable,
          currentDS: this.originalField.currentDS,
          isNew: this.originalField.isNew,
          isLegal: checkFieldLegal({fieldConfig, fieldList: fieldStore.fieldList}),
        }
        if (type === 'attribute' || type === 'quota') { 
          field.nodes = this.rootNode.children;
          field.formulaRenderModel = parseFormula(fieldConfig.nodes, fieldStore.getFieldAreaList({ fieldCategory: type }));
          // setRenderModel(field, result.data.fieldConfig, fieldStore.getFieldAreaList({ fieldCategory: type }))
        }
        if (type === 'sortField') {
          const { groupFieldConfigText, sortFieldConfigText} = parseSortFieldConfigText(fieldConfig)
          // field.groupFields = sortFieldForm.groupFields;
          // field.sortFields = sortFieldForm.sortFields;
          field.groupFieldConfigText = groupFieldConfigText;
          field.sortFieldConfigText = sortFieldConfigText;
        }
        // console.log('fieldStore.getFieldListByCategory[type] :>> ', fieldStore.getFieldListByCategory);
        fieldStore.getFieldListByCategory[type].splice(this.fieldConfigInfo.index, 1, field);
      }
      return result;
    },
    async saveFieldConfig({ params, type, sortFieldForm }) { 
      const result = await manage.saveFieldConfig(params);
      if (result.code === SUCCESS_CODE) {
        const fieldStore = useFieldStore();
        const { fieldConfig } = result.data;
        const field = {
          ...result.data,
          closable: true,
          currentDS: true,
          deleted: false,
          isNew: true,
          isLegal: checkFieldLegal({fieldConfig, fieldList: fieldStore.fieldList}),
        }
        if (type === 'attribute' || type === 'quota') { 
          field.nodes = this.rootNode.children;
          const { nodes } = fieldConfig
          field.formulaRenderModel = parseFormula(nodes, fieldStore.getFieldAreaList({ fieldCategory: type }));
          // setRenderModel(field, result.data.fieldConfig, fieldStore.getFieldAreaList({ fieldCategory: type }))
        }
        if (type === 'sortField') {
          const { groupFieldConfigText, sortFieldConfigText} = parseSortFieldConfigText(fieldConfig)
          // field.groupFields = sortFieldForm.groupFields;
          // field.sortFields = sortFieldForm.sortFields;
          field.groupFieldConfigText = groupFieldConfigText;
          field.sortFieldConfigText = sortFieldConfigText;
        }
        fieldStore.getFieldListByCategory[type].push(field);
      }
      return result;
    },
  }
})