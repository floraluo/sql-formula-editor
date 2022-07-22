import {
  INT_TYPE,     //整型
  FLOAT_TYPE,   //浮点
  STRING_TYPE,  //字符串
  DATA_SET_BASE_TYPE,     //基础型数据集
  DATA_SET_CONFIG_TYPE,   //配置型数据集
  DATA_SET_HISTORY_TYPE,  //历史核算型数据集
  DATA_SOURCE_TYPE, //数据源
  DATA_SET_TYPE,    //数据集
  TIME_DIM_MONTH,   //时间维度：月
  TIME_DIM_DAY,     //时间维度：日
  QUERY_STATUS_SUBMIT,         //查询状态：已提交
  QUERY_STATUS_EXECUTION,      //查询状态：执行中
  QUERY_STATUS_DONE,           //查询状态：已完成
  QUERY_STATUS_FAIL,           //查询状态：失败
} from './constant'

export default {
  // 数据集类型
  dataSetType: [
    { label: "基础型", value: DATA_SET_BASE_TYPE },
    { label: "配置型", value: DATA_SET_CONFIG_TYPE },
    { label: "历史核算型", value: DATA_SET_HISTORY_TYPE },
  ],
  // 血缘关系中节点类型
  nodeType: [
    {  name: '数据源', type: DATA_SOURCE_TYPE },
    {  name: '数据集', type: DATA_SET_TYPE },
  ],
  // 数据集的时间维度
  timeDimType: [
    { label: '月', value: TIME_DIM_MONTH },
    { label: '日', value: TIME_DIM_DAY },
  ],
  // 过滤条件关系
  filterRelation: [
    { label: "等于", value: 1 },
    { label: "不等于", value: 2 },
    { label: "大于", value: 3 },
    { label: "大于等于", value: 4 },
    { label: "小于", value: 5 },
    { label: "小于等于", value: 6 },
    { label: "为空", value: 7 },
    { label: "不为空", value: 8 },
    { label: "属于", value: 9 },
    { label: "不属于", value: 10 },
    { label: "like", value: 11 },
    { label: "not like", value: 12 },
  ],
  // 数据集的字段类型
  fieldType: [
    { label: '整型', value: INT_TYPE },
    { label: '浮点', value: FLOAT_TYPE },
    { label: '字符串', value: STRING_TYPE },
  ],
  // 配置型数据集的连接类型
  dataSetRelationType: [
    { label: '交集', value: 1 },
    { label: '左集', value: 2 },
    { label: '全集', value: 3 },
  ],
  // dataSetFieldType: [
  //   { label: '粒度', value: 1},
  //   { label: '指标', value: 2},
  //   { label: '属性', value: 3},
  //   { label: '排序字段', value: 4},
  // ],
  // 时间窗口下拉选项，key值对应于时间维度的value。1:月，2:日
  timeWindowOpts: {
    [TIME_DIM_MONTH]: [
      { label: '当月（月）', value: 'current-month', tip: '当月月份'},
      { label: '上月（月）', value: 'pre-month', tip: '上月月份'},
      { label: '上上月（月）', value: 'pre-pre-month', tip: '上上月月份'},
      { label: '最近三个月', value: 'recent-3-month', tip: '上上月到当月'},
      { label: '最近两个月', value: 'recent-2-month', tip: '上月到当月' },
      { label: '自定义', value: 'custom' },
      { label: '动态时间', value: 'dynamic' }
    ],
    [TIME_DIM_DAY]: [
      { label: '最近一天', value: 'recent-1-day', tip: '(T-1)'},
      { label: '最近7天', value: 'recent-7-days', tip: '(T-7) 到 (T-1)'},
      { label: '最近10天', value: 'recent-10-days', tip: '(T-10) 到 (T-1)'},
      { label: '最近30天', value: 'recent-30-days', tip: '(T-30) 到 (T-1)'},
      { label: '当月累计', value: 'current-month-days', tip: '当月1号 到 (T-1)'},
      { label: '上月累计', value: 'pre-month-days', tip: '上月1号 到 上月月末'},
      { label: '上上月累计', value: 'pre-pre-month-days', tip: '上上月1号 到 上上月月末' },
      { label: '最近三个月累计', value: 'recent-3-month-days'},
      { label: '上月月末一天', value: 'pre-month-last-day', tip: '上月月末日期'},
      { label: '当月15号', value: 'current-month-date-15', tip: '(T - 1)所在月份的15号，如果真实日期15号以前就是真实日期，如果是15号以后就是15号' },
      { label: '自定义', value: 'custom' },
      { label: '动态时间', value: 'dynamic' }
    ]
  },
  // 开启历史合算的时间窗口下拉选项，key值对应于时间维度的value。1:月，2:日
  historyTimeWindowOpts: {
    [TIME_DIM_MONTH]: [
      { label: '数据当月（月）', value: 'current-month_base-data', tip: '当月月份'},
      { label: '政策当月（月）', value: 'current-month_base-policy', tip: '当月月份'},
      { label: '数据上月（月）', value: 'pre-month_base-data', tip: '上月月份'},
      { label: '政策上月（月）', value: 'pre-month_base-policy', tip: '上月月份'},
      { label: '数据上上月（月）', value: 'pre-pre-month_base-data', tip: '上上月月份'},
      { label: '政策上上月（月）', value: 'pre-pre-month_base-policy', tip: '上上月月份'},
      { label: '最近数据三个月', value: 'recent-3-month_base-data', tip: '上上月到当月'},
      { label: '最近政策三个月', value: 'recent-3-month_base-policy', tip: '上上月到当月'},
      { label: '最近数据两个月', value: 'recent-2-month_base-data', tip: '上月到当月' },
      { label: '最近政策两个月', value: 'recent-2-month_base-policy', tip: '上月到当月' },
      { label: '自定义', value: 'custom' },
      { label: '动态时间', value: 'dynamic' }
    ],
    [TIME_DIM_DAY]: [
      { label: '最近数据一天', value: 'recent-1-day_base-data', tip: '(T-1)'},
      { label: '最近政策一天', value: 'recent-1-day_base-policy', tip: '(T-1)'},
      { label: '最近数据7天', value: 'recent-7-days_base-data', tip: '(T-7) 到 (T-1)'},
      { label: '最近政策7天', value: 'recent-7-days_base-policy', tip: '(T-7) 到 (T-1)'},
      { label: '最近数据10天', value: 'recent-10-days_base-data', tip: '(T-10) 到 (T-1)'},
      { label: '最近政策10天', value: 'recent-10-days_base-policy', tip: '(T-10) 到 (T-1)'},
      { label: '最近数据30天', value: 'recent-30-days_base-data', tip: '(T-30) 到 (T-1)'},
      { label: '最近政策30天', value: 'recent-30-days_base-policy', tip: '(T-30) 到 (T-1)'},
      { label: '数据当月累计', value: 'current-month-days_base-data', tip: '当月1号 到 (T-1)'},
      { label: '政策当月累计', value: 'current-month-days_base-policy', tip: '当月1号 到 (T-1)'},
      { label: '数据上月累计', value: 'pre-month-days_base-data', tip: '上月1号 到 上月月末'},
      { label: '政策上月累计', value: 'pre-month-days_base-policy', tip: '上月1号 到 上月月末'},
      { label: '数据上上月累计', value: 'pre-pre-month-days_base-data', tip: '上上月1号 到 上上月月末'},
      { label: '政策上上月累计', value: 'pre-pre-month-days_base-policy', tip: '上上月1号 到 上上月月末'},
      { label: '数据上月月末一天', value: 'pre-month-last-day_base-data', tip: '上月月末日期'},
      { label: '政策上月月末一天', value: 'pre-month-last-day_base-policy', tip: '上月月末日期'},
      { label: '数据当月15号', value: 'current-month-date-15_base-data', tip: '(T - 1)所在月份的15号，如果真实日期15号以前就是真实日期，如果是15号以后就是15号' },
      { label: '政策当月15号', value: 'current-month-date-15_base-policy', tip: '(T - 1)所在月份的15号，如果真实日期15号以前就是真实日期，如果是15号以后就是15号' },
      { label: '自定义', value: 'custom' },
      { label: '动态时间', value: 'dynamic' }
    ]
  },
  // timeWindowOfMonth: [
  //   { label: '最近一天', value: 'recent-1-day', tip: '(T-1)'},
  //   { label: '最近7天', value: 'recent-7-days', tip: '(T-7) 到 (T-1)'},
  //   { label: '最近10天', value: 'recent-10-days', tip: '(T-10) 到 (T-1)'},
  //   { label: '最近30天', value: 'recent-30-days', tip: '(T-30) 到 (T-1)'},
  //   { label: '当月累计', value: 'current-month-days', tip: '当月1号 到 (T-1)'},
  //   { label: '上月累计', value: 'pre-month-days', tip: '上月1号 到 上月月末'},
  //   { label: '上上月累计', value: 'pre-pre-month-days', tip: '上上月1号 到 上上月月末'},
  //   { label: '上月月末一天', value: 'pre-month-last-day', tip: '上月月末日期'},
  //   { label: '当月15号', value: 'current-month-date-15', tip: '(T - 1)所在月份的15号，如果真实日期15号以前就是真实日期，如果是15号以后就是15号' },
  //   { label: '自定义', value: 'custom' },
  //   { label: '动态时间', value: 'dynamic' }
  // ],
  // timeWindowOfDay: [
  //   { label: '当月（月）', value: 'current-month', tip: '当月月份'},
  //   { label: '上月（月）', value: 'pre-month', tip: '上月月份'},
  //   { label: '上上月（月）', value: 'pre-pre-month', tip: '上上月月份'},
  //   { label: '最近三个月', value: 'recent-3-month', tip: '上上月到当月'},
  //   { label: '最近两个月', value: 'recent-2-month', tip: '上月到当月' },
  //   { label: '自定义', value: 'custom' },
  //   { label: '动态时间', value: 'dynamic' }
  // ],

  // 数据稽核查询状态
  queryStatus:  {
    [QUERY_STATUS_SUBMIT]: '已提交',
    [QUERY_STATUS_EXECUTION]: '执行中',
    [QUERY_STATUS_DONE]: '已完成',
    [QUERY_STATUS_FAIL]: '失败',
  },


  // 批量新增指标的聚合函数下拉选项
  aggregationOpts: [
    { name: '求和', type: 'sum', desc: '合计', fieldType: 0 },
    { name: '最大值', type: 'max', desc: '最大值', fieldType: 0 },
    { name: '最小值', type: 'min', desc: '最小值', fieldType: 0 },
    { name: '平均值', type: 'avg', desc: '平均值', fieldType: FLOAT_TYPE },
    { name: '计数', type: 'count', desc: '计数', fieldType: INT_TYPE },
    { name: '去重计数', type: 'count-distinct', desc: '去重计数', fieldType: INT_TYPE },
  ],
  // 计算任务血缘图中节点的状态
  calcStatus: [
    { value: 1, label: '待执行' },
    { value: 2, label: '执行中' },
    { value: 3, label: '已完成' },
    { value: 4, label: '已失败' },
    { value: 5, label: '已停止' },
  ],
  // 新建diff配置中表类型
  tableType: [
    { value: 1, label: '业务线表'},
    { value: 2, label: '剑刃表'},
    { value: 3, label: 'XT表'},
  ],
  // 计算任务监控类型
  calcTaskMonitorType: [
    { name: 'CALC_TASK_DURATION', value: 1001, label: "执行时长"},
    { name: 'CALC_TASK_READY_TIME', value: 1002, label: "就绪时间"},
  ],
  // 
  tableMonitorType: [
    { name: 'TABLE_ENTITY_UNIQUE', value: 2001, label: "粒度唯一性"},
    { name: 'TABLE_PARTITION_ROW_COUNT', value: 2002, label: "数据量"},
    { name: 'TABLE_TASK_DURATION', value: 2003, label: "执行时长"},
    { name: 'TABLE_TASK_READY_TIME', value: 2004, label: "就绪时间"},
  ],
  fieldMonitorType: [
    { value: 3001, label: '合计值', name: 'FIELD_SUM'},
    { value: 3002, label: 'Null值记录数', name: 'FIELD_COUNT_NULL'},
    { value: 3003, label: '0值记录数', name: 'FIELD_COUNT_0'},
    { value: 3004, label: '空字符串记录数', name: 'FIELD_COUNT_EMPTY_STR'},
    { value: 3005, label: 'Null值/0值记录数', name: 'FIELD_COUNT_NULL_OR_0'},
    { value: 3006, label: 'Null值/0值/空字符串记录数', name: 'FIELD_COUNT_NULL_OR_0_OR_EMPTY_STR'},
    { value: 3007, label: '最大值', name: 'FIELD_MAX'},
    { value: 3008, label: '最小值', name: 'FIELD_MIN'},
    { value: 3009, label: '平均值', name: 'FIELD_AVG'},
    { value: 3010, label: '值域记录数', name: 'FIELD_COUNT'},
    { value: 3011, label: '去重记录数', name: 'FIELD_COUNT_DISTINCT'},
    { value: 3012, label: '重复记录数', name: 'FIELD_REPEAT_COUNT'},
  ],
  dbList: [
    { value: 'mart_msalary', label: 'mart_msalary'},
    { value: 'mart_msalary_test', label: 'mart_msalary_test'},
    { value: 'mart_caterp', label: 'mart_caterp'},
  ],
  dsnList: [
    { value: 'hmart_msalary', label: 'hmart_msalary'},
    { value: 'hmart_msalary_test', label: 'hmart_msalary_test'},
    { value: 'hmart_caterp', label: 'hmart_caterp'},
  ],
  // 计算配置中的计算范围下拉选项
  calcScopeList: [
    { value: 1, label: '当月' },
    { value: 2, label: '当月+上月' },
    { value: 3, label: '最近三个月' },
  ],
  //库类型
  dbType: [
    { value: 1, label: '正式库'},
    { value: 2, label: '测试库'},
  ]

}



