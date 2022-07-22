<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <el-row :gutter="10">
      <el-col :span="12">
        <Editor ref="editor"/>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6"><el-button type="primary" @click="save">保存</el-button></el-col>
    </el-row>
    
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Editor from '@/components/editor/Editor'
import formatFormula from '@/utils/formatFormula'
import {  METRIC_CODE, ATTRIBUTE_CODE } from '@/lib/constant'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Editor
  },
  methods: {
    _formatParams(){
      let fieldCategoryMap = {
        'quota': METRIC_CODE,
        'attribute': ATTRIBUTE_CODE
      }
      return {
          fieldConfig: {
            type: 'nodeList',
            nodes: formatFormula(this.$refs.editor.rootNode.children)
          },
        }
    },
    //验证粘贴公式的字段是否合法
    _validPasteFormulaField(nodes){
      return nodes.some(node => {
        if (node.type === 'field' || node.type === 'self-field') {
          // 引用上有数据集字段判断fieldColumnName、dataSetAlias、dataSetId都相等
          // console.log('node :>> ', node);
          let field = node.type === 'field' && this.fieldAreaList.find(field => field.fieldColumnName === node.fieldColumnName && field.dataSetAlias === node.dataSetAlias && field.dataSetId === node.dataSetId);
          // 引用本数据集字段判断fieldColumnName相等
          let selfField = node.type === 'self-field' && this.fieldAreaList.find(field => field.fieldColumnName === node.fieldColumnName);
          if (field === undefined || selfField === undefined) {
            this.$mtd.confirm({
              title: '提示',
              type: 'warning',
              message: `公式中存在不合法的字段【${node.fieldShowName}】`
            })
            return true;
          } else {
            // 基础型字段没有dataSourceId，打个补丁
            const dataSourceId = field.dataSourceId || selfField.dataSourceId;
            node.dataSourceId = dataSourceId;
            return false;
          }
        } else if (node.children){
          return node.children.some(child => {
            // console.log('this._validPasteFormulaField(child) :>> ', this._validPasteFormulaField(child));
            return this._validPasteFormulaField(child);
          });
        }
      })
    },
    save() {
      // 如果是粘贴的公式，需要验证粘贴的字段是否合法
      if (this._validPasteFormulaField(this.$refs.editor.rootNode.children)) return;
      // const categoryFieldList = this.fieldStore[`${this.modalType}List`];
      const params = this._formatParams();
      console.log('params :>> ', params);
      // if (this.fieldConfigInfo.fieldColumnName) {
      //   await this.modalFieldStore.updateFieldConfig({params, type: this.modalType})
      //   this.closeModal();
      // } else {
      //   await this.modalFieldStore.saveFieldConfig({params, type: this.modalType});
      //   this.closeModal();
      // }
    },
  }
}
</script>
