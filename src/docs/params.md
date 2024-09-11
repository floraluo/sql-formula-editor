## 公式定义

占位符：

1. 所在位置没有节点才显示
2. 点击占位符，传上一个位置的节点
3. 点击占位符判断上一个占位符是否为空
4. 更新光标位置

更新节点path算法
获取插入节点层数、同层索引
找到插入节点同层所有节点sameLevelNodeList
从同层索引处开始遍历sameLevelNodeList,更新索引后所有节点索引
## 渲染页面数据模型

### method
{
  "path": "2-2",
  "startChar": "max(",
  "paramAmount": 3,
  "char": "最大值(...)",
  "name": "max",
  "endChar": ")",
  "type": "method",
  "children": [
      [
          {
              "path": "2-2-0-0",
              "name": 2,
              "char": 2,
              "type": "digit",
              "value": 2,
              "inStructNodeType": "method"
          }
      ],
      [
          {
              "path": "2-2-1-0",
              "name": 3,
              "char": 3,
              "type": "digit",
              "value": 3,
              "inStructNodeType": "method"
          }
      ],
      [
          {
              "path": "2-2-2-0",
              "char": "=",
              "name": "=",
              "type": "operator",
              "inStructNodeType": "method"
          }
      ]
  ],
  "inStructNodeType": "statement2"
}

### if
{
  "path": "2",
  "char": "if",
  "name": "if",
  "type": "if",
  "children": [
      {
          "path": "2-0",
          "name": 3,
          "char": 3,
          "type": "digit",
          "value": "33",
          "inStructNodeType": "condition"
      },
      {
          "path": "2-1",
          "name": 4,
          "char": 4,
          "type": "digit",
          "value": 4,
          "inStructNodeType": "statement1"
      }
  ]
}
<!-- joinInfo: [ 
  {
    masterDataSet: {
      alias: String,
      dataSetId: Number,
      dataSetName: String,
      dataSetVersion: Number,
      fields: [],
      entityIdObj
    },
    slaveDataSet: {
      alias: String,
      dataSetId: Number,
      dataSetName: String,
      dataSetVersion: Number,
      fields: [],
      entityIdObj
    }
  }
] -->

masterDataSet: {
  alias: String,
  dataSetId: Number,
  dataSetName: String,
  dataSetVersion: Number,
  fields: [],
  entityIdObj
}
<!-- slaveDataSetList: [
  slaveDataSet: {
    alias: String,
    dataSetId: Number,
    dataSetName: String,
    dataSetVersion: Number,
    fields: [],
    entityIdObj
  }
] -->

slaveDataSetList: [
  {
    alias: String,
    dataSetId: Number,
    dataSetName: String,
    dataSetVersion: Number,
    fields: [],
    entityIdObj
  }
]
joinConditionList: [
  {
    masterFieldColumnName: Number,
    masterFieldName: String,
    slaveFieldColumnName: Number,
    slaveFieldName: String
  }
]
form.slaveDataSetList = [
  {
    alias: String,
    dataSetId: Number,
    dataSetName: String,
    dataSetVersion: Number,
    fields: [],
    joinConditionList: [
      {
        master: {field},
        slave: {field}
      }
    ]
  }
]

"joinInfo": [
  {
    "joinConditionList": [
      {
        "masterFieldColumnName": 0,
        "slaveFieldColumnName": 0
      }
    ],
    "joinType": 0,
    "slaveDataSetId": 0
  }
]
joinInfoList: [ //数据集连接表
  {
    alias,
    joinConditionList: [
      <!-- 
      计算规则：
      1. 获取到数据集fields
      2. fieldEntityId > 0，ID做为key保存此field
      3. 比对主副数据集有相同fieldEntityId的字段作为关联条件-->
      {
        master: <dataSet>,
        slave: <dataSet>
      }
    ], //连接实体列表
    joinType: 0, //连接类型
    slaveDataSet: this.slaveDataSetList[index],
    masterDataSet: this.masterDataSet
  }
]

"filterConfig": {
  "type":"or",
  "children":[
    {
      "type":"and",
      "children":[
        {
          "type":"condition",
          "left":{
            "type":"field",
            "fieldColumnName":1001,
            "dataSetAlias":"t1"
          },
          "relation":1,
          "arg1":100
        }
      ]
    }
  ]
} 
filterConditionList: [
  [
    {
      left: <dataSet>
      relation: Number,
      arg1: String,
      formulaModel: [], //格式化后的公式模型，用于传参
      nodes:[] //渲染页面结构的模型
    }
  ]
]

masterDataSet = {
  alias: string,
  fields: [],
  entityIdObj: {
    fieldColumnName: field
  }
  ...dataSet
}
timeWindowList: [
  {
    timeWindow:
    timeWindowType //设置自定义和动态时间时，保存timeWindow的值
    customTime: []
    dynamicTime: [],
    ...{masterDataSet}
  },
  ...slaveDataSetList
]

<!-- 每个数据集保存一个key -->
dataSetFieldObj: {
  `${dataSet.alias}_${dataSet.dataSetId}`: dataSet.fields.map(field => {
        return Object.assign(field, {
          fieldShowName: `${dataSet.alias}_${field.fieldShowName}`,
          fieldShowNameOrigin: field.fieldShowName,
          fieldTableId: `${field.fieldColumnName}_${field.dataSetId}`
        })
      })
}
<!-- dataSetFieldObj所有value提取成二维数组，然后二维转一维 -->
filterConditionOpts:Object.values(this.dataSetFieldObj).reduce((prev, current) => {
        return prev.concat(current);
      })
      {
        
        fieldShowNameFormat: "自定义"
        custom: true
      }


增加表单验证
修改一个地方，sql验证
左集默认ok
新增指标可删除
副数据集删除按钮ok
数据集连接表样式


{
    "columnMetaInfo": [
        {
            "fieldColumnName": 1001,
            "fieldName": "tf_100_1001",
            "fieldShowName": "员工ID",
            "fieldType": null,
            "fieldCategory": null,
            "fieldEntityId": null,
            "fieldSchemePosition": null,
            "fieldShowPosition": null,
            "columnStatus": null,
            "expression": null
        },
        {
            "fieldColumnName": 1002,
            "fieldName": "tf_100_1002",
            "fieldShowName": "工单数",
            "fieldType": null,
            "fieldCategory": null,
            "fieldEntityId": null,
            "fieldSchemePosition": null,
            "fieldShowPosition": null,
            "columnStatus": null,
            "expression": null
        },
        {
            "fieldColumnName": 1003,
            "fieldName": "tf_100_1003",
            "fieldShowName": "会员得分",
            "fieldType": null,
            "fieldCategory": null,
            "fieldEntityId": null,
            "fieldSchemePosition": null,
            "fieldShowPosition": null,
            "columnStatus": null,
            "expression": null
        }
    ],
    "resultList": [
        {
            "tf_100_1001": 2001,
            "tf_100_1002": 58,
            "tf_100_1003": 80
        },
        {
            "tf_100_1001": 2002,
            "tf_100_1002": 38,
            "tf_100_1003": 60
        },
        {
            "tf_100_1001": 2003,
            "tf_100_1002": 88,
            "tf_100_1003": 90
        },
        {
            "tf_100_1001": 2004,
            "tf_100_1002": 100,
            "tf_100_1003": 50
        }
    ]
}