# 公式渲染节点模型

解析公式模型成渲染页面的数据模型

## 渲染节点所有属性一览

```js
renderNode = {
  type: String:[digit, operator, method, case, if, field, constant], //节点分类的类型
  renderType: String:[digit, operator, fixedParams, dynamicParams, customParams, case, field, constant] //页面渲染类型
  paramsType: String:[digit, operator, case, if, field, self-field, system, constant, fixed-params-method, dynamic-params-method, ], //传给后台的类型
  path: String[], //节点路径
  place: String:[rootChildren, fixedParams, dynamicParams, customParams, caseCondition, caseValue, caseDefaultValue] //等于父节点的renderType（case节点例外）有子节点的是块级节点（method，if，case）
  children: Array:[] //[method, case, if]
  value: String //[digit, constant]
  char: String //[operator]
  fieldShowName: String //[field]
  disabled: false //默认值false 【constant】节点输入完成时，disabled = true
  tooltipVisible: false //默认值false 【constant】节点input失去焦点值为空时，tooltipVisible = true
}
```

## method

### fixedParams

``` js
node = {
  type: 'method',
  renderType: 'fixedParams',
  path: String，
  place: String,
  children: [[],[],...] //参数个数渲染
}
```

### dynamicParams

```js
node = {
  type: 'method',
  renderType: 'dynamicParams',
  path: String，
  place: String,
  children: [[],[]] //初始默认2个参数
}
```

### customParams

customParams方法就一个like，参数也只有一个

```js
node = {
  type: 'method',
  renderType: 'customParams',
  place: String,
  path: String，
  children: [[{
    renderType: 'constant',
    place: 'method',
    value: null, //常量值
    disabled: false, //disabled input
    tooltipVisible: false //
  }]], //默认一个参数
}
```

## constant

```js
node = {
  type: node.type,
  renderType: node.type
  path: String，
  place: String,
  value: node.value,
  disabled: true, // value有值disabled = true
  tooltipVisible: false // 默认false，input失去焦点再决定true或false
}
```

## digit

```js
node = {
  type: 'digit' //node.type
  renderType: 'digit', // node.type
  path: String，
  place: String,
  value: 123, //node.value
}
```

## operator

```js
node = {
  type: 'operator' //node.type
  renderType: 'operator', //node.type
  path: String，
  place: String,
  char: '>', //node.name
}
```

## case

```js
node = {
  type: node.type,
  renderType: node.type,
  path: String，
  place: parentNode.type,
  children:[ [],...,[]] //默认两个数组，最后一个数组始终是defaultValue
}
### case的参数节点
node = {
  type: node.type,
  renderType: node.renderType
  path: String，
  place: [condition, statement1, statement2],
  [children]: []
}
### eg:
node = {
  type: 'case',
  renderType: 'case',
  path: '0'
  place: 'rootChildren',
  children: [
    [
      {
        type: 'field',
        renderType: 'field',
        path: '0-0-0',
        place: 'caseCondition',
        fieldShowName: 't1_工单'
      },
      {
        type: 'method',
        renderType: 'fixedParams',
        path: '0-0-1',
        place: 'caseValue',
        name: 'ceil',
        children: [
          [
            {
              type: 'field',
              renderType: 'field',
              place: 'method',
              fieldShowName: 't1_流水'
            }
          ]
        ]
      }
    ],
    [
      {
        type: 'field',
        renderType: 'field',
        path: '0-1-0',
        place: 'caseDefaultValue',
        fieldShowName: 't2_月销售额'
      }
    ]
  ]
}
```

## field

```js
node = {
  type: node.type
  renderType: node.type,
  path: String，
  place: String:[rootChildren, method, if, condition, statement1, statement2]
  fieldShowName: node.fieldShowName,
}
```
