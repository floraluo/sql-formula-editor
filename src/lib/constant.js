// ------------------start status code----------------

export const SUCCESS_CODE = 0;

// ------------------end status code----------------


// ------------------start enums value----------------

export const TIME_DIM_MONTH = 1;    //时间维度：月
export const TIME_DIM_DAY = 2;      //时间维度：日
export const ENTITY_CODE = 1;       //字段类型：粒度
export const METRIC_CODE = 2;       //字段类型：指标
export const ATTRIBUTE_CODE = 3;    //字段类型：属性
export const ROW_NUMBER_CODE = 4;   //字段类型：排序字段

export const DATA_SOURCE_TYPE = 1;  //数据源
export const DATA_SET_TYPE = 2;     //数据集
export const DATA_SET_BASE_TYPE = 1; //数据集基础类型
export const DATA_SET_CONFIG_TYPE = 2; //数据集配置类型
export const DATA_SET_HISTORY_TYPE = 3; //数据集历史核算类型

export const INT_TYPE = 1;          //整型
export const FLOAT_TYPE = 2;        //浮点型
export const STRING_TYPE = 3;        //字符串

export const QUERY_STATUS_SUBMIT = 0;     //查询状态：已提交
export const QUERY_STATUS_EXECUTION = 1;  //查询状态：执行中
export const QUERY_STATUS_DONE = 2;       //查询状态：已完成
export const QUERY_STATUS_FAIL = 3;       //查询状态：失败
export const QUERY_STATUS_CANCEL = 4;     //查询状态：已取消


// ------------------end enums value----------------
export const MASTER_DATA_SET = 'master_data_set';
export const SLAVE_DATA_SET = 'slave_data_set';
export const DATA_SOURCE = 'data_source';

// ------------------start 血缘图配色----------------
export const nodeTypeLightColor = {
  1: '#ffe6c4', // 数据源浅色
}
export const nodeTypeDepColor = {
  1: '#ffbb00', // 数据源深色
}
// 浅色数据集
export const dataSetTypeLightColor = {
  1: '#c6f0ff', // 基础型数据集浅色
  2: '#c9ffef', // 配置型数据集浅色
  3: '#e1e0ff', // 历史核算型数据集浅色
}
// 深色数据集
export const dataSetTypeDepColor = {
  1: '#7ddcff', // 基础型数据集深色
  2: '#3effc6', // 配置型数据集深色
  3: '#8e8aff',  // 历史核算型数据集深色
}
export const dataSetTypeDoubleDepColor = {
  1: '#00baff', // 基础型数据集深色
  2: '#00e3a0', // 配置型数据集深色
  3: '#6e69ff',  // 历史核算型数据集深色
}
export const dataSetCalcStatusColor = {
  1: '#f1de00',
  2: '#2f87ff',
  3: '#00d815',
  4: '#d80000',
  5: 'gray',
}
// ------------------end 血缘图配色----------------

// 数据集字段血缘关系图
export const fieldCategory = {
  [ENTITY_CODE]: '粒度',
  [METRIC_CODE]: "指标",
  [ATTRIBUTE_CODE]: "属性",
  [ROW_NUMBER_CODE]: "排序字段",
  99:'分区'
}
export const fieldTypeName = {
  [INT_TYPE]: '整型',
  [FLOAT_TYPE]: "浮点",
  [STRING_TYPE]: "字符串",
}
export const dataSetTypeName = {
  [DATA_SET_BASE_TYPE]: '基础型',
  [DATA_SET_CONFIG_TYPE]: "配置型",
  [DATA_SET_HISTORY_TYPE]: "历史核算型",
}

// ------------------数据集版本对比配色----------------------
export const contentStatus = {
  same:'rgba(0,0,0,.12)',
  delete:'#f5483b', // 删除内容
  insert:"#00b365", // 新增内容
  change:"#0a70f5", // 变更内容
  none: "transparent",
  undefined: "transparent",
}
export const contentTypeList= [
  { label: "删除内容", value: 'delete'},
  { label: "新增内容", value: 'insert'},
  { label: "变更内容", value: 'change'},
]
