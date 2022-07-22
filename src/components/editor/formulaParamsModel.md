# 公式参数模型说明

doc: https://km.sankuai.com/page/1218259214

1. 函数定义：固定参数个数的函数

    ``` json
    {
      "type":"fix-params-method",
      "name":"xxxxx", //具体的函数名称
      "params":[]
    }
    ```

2. 函数定义：不定参数个数的函数

    ``` json
    {
      "type":"dynamic-params-method",
      "name":"xxxxx", //具体的函数名称
      "params":[]
    }
    ```

3. 操作符定义

    ``` json
    {
      "type":"operator",
      "name":"+",   //具体的操作符号
    }
    ```

4. IF结构

    ``` json
    {
      "type":"if",
      "params":[]
    }
    ```

5. CASE结构
    中文：
    case:分支判断
    when:条件
    then:公式
    defaultValue：默认值

    ``` json
    {
      "type":"case",
      "params":[
          {
            "condition":{ },
            "value":{}
          }
      ],
      "defaultValue":{}
    }
    ```

6. 数字

    ```json
    {
      "type":"digit",
      "value":"101"   //具体的数字值
    }
    ```

7. 字符串常量

    ```json
    {
      "type":"constant",
      "value":"xxxx"   //具体的字符串
    }
    ```

8. 字段引用:引用上游字段

    ```json
    {
      "type":"field",
      "fieldColumnName": "c_1000"		//具体的字段ID
      "dataSetId":10001,
      "dataSetAlias":t1  
    }
    ```

9. 字段引用:引用本数据集字段

    ```json
    {
      "type":"self-field",
      "fieldColumnName": "c_1001"		//具体的字段ID
      "dataSetId":null,
      "dataSetAlias":null  
    }
    ```

10. 元素组合

    ```json
    {
      "type":"nodeList",
      "nodes":[ ]
    }
    ```

11. 系统常量/变量

    ```json
    {
      "type":"system",
      "value":""
    }
    ```
