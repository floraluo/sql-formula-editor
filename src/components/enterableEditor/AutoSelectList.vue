<template>
  <ul class="auto-select-list" 
  id="scrollPanel"  
  ref="selectPanel"
  :style="{'left': left, 'top': top}">
    <template v-if="isMethodList" >
      <li 
        class="auto-select-item"
        v-for="item in selectList" :key="item.name"
      >{{ item.name }}</li>
    </template>
    <template v-else-if="isFieldList" >
      <li 
        class="auto-select-item"
        v-for="(item, index) in selectList" :key="item.fieldDisplayName ? item.fieldDisplayName : item.showName"
        :class="{on: index === selectItemIndex}"
        @click="handleSelectItem(item)"
      >{{ item.fieldDisplayName || item.label }}</li>
    </template>
  </ul>
</template>
<script>
import { storeToRefs } from 'pinia'
import { useModalFieldStore } from '@/store/modal/modalFieldStore'
import { useFieldStore } from '@/store/dataSet/fieldStore';
import { useSqlTextEditorStore } from '@/store/modal/sqlTextEditor';
export default {
  props: {
    // selectList: { type: Array, require },
    listType: { type: String }, // field, method
    type: { type: String }, // quota, attribute, field
    // selectItemIndex: { type: Number },
    // left: { type: Number, default: 0},
  },
  computed: {
    left() {
      return this.selectPanelLeft + 'px'
    },
    top() {
      return this.selectPanelTop + 'px'
    },
    isMethodList() {
      return this.listType === 'method'
    },
    isFieldList() {
      return this.listType === 'field'
    },
    fieldAreaList() {
      if (this.type) {
        return this.fieldStore.getFieldAreaList({fieldCategory: this.type}).map(field => {
          if (field.currentDS) {
            field.fieldDisplayName = field.fieldShowName;
          }
          return field;
        });
      } else {
        return [];
      }
    },
    selectList: function() {
      const { selectPanelType } = this.sqlTextEditorStore;
      let selectList;
      if (selectPanelType === 'fieldList') {
        const fieldList = this.fieldAreaList.filter(field => field.fieldShowName.search(this.fieldKeyword) > -1)
        selectList = fieldList;

      } else if (selectPanelType === 'btnList') {
        // const funList = this.funList.filter(btn => {
        //   const { char, name } = btn;
        //   return char.search(this.fieldKeyword) > -1 || name.search(this.fieldKeyword) > -1
        // });
        // console.log('funList :>> ', funList);
        // selectList = funList;
        selectList = this.getFunListWithFilter(this.type);
      }
      // console.log('this.sqlTextEditorStore.selectList :>> ', this.sqlTextEditorStore.selectList);
      this.sqlTextEditorStore.selectList = selectList;
      return selectList
    },
  },
  data() {
    return {}
  },
  setup() {
    const modalFieldStore = useModalFieldStore();
    const fieldStore = useFieldStore();
    const { fieldConfigInfo, originalField } = storeToRefs(modalFieldStore);
    const sqlTextEditorStore = useSqlTextEditorStore();
    const { 
      getFunListWithFilter,

      showAutoSelectList,
      handleSelectItem,
      selectPanelLeft,
      selectPanelTop,
      selectItemIndex,
      fieldKeyword
    } = storeToRefs(sqlTextEditorStore);

    

    return {
      fieldStore,
      modalFieldStore,
      fieldConfigInfo,
      originalField,

      getFunListWithFilter,
      showAutoSelectList,
      sqlTextEditorStore,
      handleSelectItem,
      selectPanelLeft,
      selectPanelTop,
      selectItemIndex,
      fieldKeyword
    }
  },
  created() {},
  mounted() {
    // this.sqlTextEditorStore.$refs['selectPanel'] = this.$refs.selectPanel;
    // this.sqlTextEditorStore.$subscribe((mutation, state) => {
      // // import { MutationType } from 'pinia'
      // mutation.type // 'direct' | 'patch object' | 'patch function'
      // // 与 cartStore.$id 相同
      // mutation.storeId // 'cart'
      // // 仅适用于 mutation.type === 'patch object'
      // mutation.payload // 补丁对象传递给 to cartStore.$patch()

      // // 每当它发生变化时，将整个状态持久化到本地存储
      // localStorage.setItem('cart', JSON.stringify(state))
      // if (state.showAutoSelectList && mutation.type === 'direct') {
      //   console.log('state :>> ', state);
      //   this.sqlTextEditorStore.$refs['selectPanel'] = this.$refs.selectPanel;
      // }
    // })
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.auto-select-list {
  min-width: 160px;
  // min-height: 92px;
  max-height: 215px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px 0px rgba(74, 81, 93, 0.25);
  border-radius: 2px;
  border: 1px solid rgba(217, 217, 217, 1);
  position: absolute;
  // bottom: -92px;
  z-index: 99;
  padding: 0;
  margin: 0;
  overflow-y: auto;

  .auto-select-item {
    cursor: pointer;
    width: 100%;
    height: 30px;
    padding: 0 10px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #333333;

    &:hover {
      background: rgba(240, 243, 249, 1);
    }
    &.on {
      background: #f0f3f9;
    }
  }
}
</style>