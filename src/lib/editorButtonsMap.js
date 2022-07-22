/**
 * @description 按钮映射表
 * char: 按钮字符
 * name:  接口传值名称
 * layoutType：按钮布局类型 [baseSign: 基本符号，aggregate：聚合函数，math：数学函数，type: 类型，date：日期函数，other：其他]
 * paramsType: 传参类型 [digit, operator, fix-params-method,dynamic-params-method, if, case, field,self-field, constant, system, nodeList, data-type]
 * category: 类别 简化paramsType中的类型[digit, operator, method, if, case, field, constant, dataType]
 * renderType: 渲染类型 [text, fixedParams, dynamicParams, customParams, case, tag] 
 * quota: 配置指标时，是否可显示 （按钮布局改版后已没引用，暂时保留）
 * attribute: 配置属性时，是否可显示（按钮布局改版后已没引用，暂时保留）
 * field: 配置字段（过滤条件）时，是否可显示（按钮布局改版后已没引用，暂时保留）
 * 类别范围：category[paramsType]
 *    digit[digit]
 *    operator[operator]
 *    if[if] case[case]
 *    method[fix-params-method, dynamic-params-method]
 *    field[field, self-field]
 *    constant[system, constant]
 *    dataType[data-type(不包括decimal类型)]
 */

export default {
  btnGroup: [
    { char: '0', name: "0", value: "0", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '1', name: "1", value: "1", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '2', name: "2", value: "2", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '3', name: "3", value: "3", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '4', name: "4", value: "4", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '5', name: "5", value: "5", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '6', name: "6", value: "6", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '7', name: "7", value: "7", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '8', name: "8", value: "8", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    { char: '9', name: "9", value: "9", layoutType: "baseSign", category: 'digit', renderType: 'text', paramsType: 'digit', quota: 1, attribute: 1, field: 1 },
    
    { char: '.', name: ".", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '.' },
    { char: '&plus;', name: "+", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&plus;' },
    { char: '&minus;', name: "-", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&minus;' },
    { char: '&times;', name: "*", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&times;' },
    { char: '&divide;', name: "/", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&divide;' },
    { char: '&gt;', name: ">", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&gt;' },
    { char: '&ge;', name: ">=", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&ge;' },
    { char: '&lt;', name: "<", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&lt;' },
    { char: '&le;', name: "<=", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&le;' },
    { char: '&ne;', name: "<>", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '&ne;' },
    { char: '=', name: "=", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '=' },
    { char: '(', name: "(", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '('},
    { char: ')', name: ")", layoutType: "baseSign", category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: ')' },
    
    
    
    
    { char: 'sum', name: 'sum', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：sum(c) <br>说明：求c列的和' },
    { char: 'max', name: 'max', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：max(c) <br>说明：求c列的最大指' },
    { char: 'min', name: 'min', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：min(c) <br>说明：求c列的最小指' },
    { char: 'avg', name: 'avg', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：avg(c) <br>说明：求c列的平均值' },
    { char: 'count', name: 'count', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：count(c) <br>说明：求c列的个数' },
    { char: 'count-distinct', name: 'count-distinct', layoutType: "aggregate", category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 0, field: 0, desc: '语法：count(distinct c) <br>说明：求c列的去重个数' },
   
    { char: 'round', name: 'round', layoutType: 'math', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:2, quota: 1, attribute: 1, field: 1, desc: '语法：round(x,y)<br>说明：对参数x进行四舍五入，保留y位小数<br>示例：round(10.25,1) => 10.3<br>　　　round(10.5,0) => 11' },
    { char: 'ceil', name: 'ceil', layoutType: 'math', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 1, field: 1, desc: '语法：ceil(x)<br>说明：对参数x进行向上取整<br>示例：ceil(3.14) => 4<br>　　　ceil(3.54) => 4' },
    { char: 'floor', name: 'floor', layoutType: 'math', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 1, field: 1, desc: '语法：floor(x)  <br>说明：对参数x进行向下取整<br>示例：floor(3.14) => 3<br>　　　floor(3.54) => 3' },
    { char: 'abs', name: 'abs', layoutType: 'math', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount:1, quota: 1, attribute: 1, field: 1, desc: '语法：abs(x)  <br>说明：求参数x的绝对值<br>示例：abs(-3.14) => 3.14' },
    { char: 'least', name: 'least', layoutType: 'math', category: 'method', renderType: 'dynamicParams', paramsType: 'dynamic-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：least(x1,x2,...)  <br>说明：求x1,x2...中的最小值<br>示例：least(1,2,3) => 1' },
    { char: 'greatest', name: 'greatest', layoutType: 'math', category: 'method', renderType: 'dynamicParams', paramsType: 'dynamic-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：greatest(x1,x2,...)  <br>说明：求x1,x2...中的最大值<br>示例：greatest(1,2,3) => 3' },


    { char: 'add_months', name: 'add_months', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：add_months(date,N) <br>说明：对某个日期date偏移N个月，正数往未来偏移，负数往历史偏移<br>示例：add_months(\'2022-03-10\',1) => 2022-04-10' },
    { char: 'date_add', name: 'date_add', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：date_add(startdate,N)  <br>说明：返回开始日期startdate增加days天后的日期<br>示例：date_add(\'2022-03-10\',1) => 2022-03-11' },
    { char: 'date_sub', name: 'date_sub', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：date_sub(startdate,N)  <br>说明：返回开始日期startdate减少days天后的日期<br>示例：date_sub(\'2022-03-10\',1) => 2022-03-09' },
    { char: 'date_format', name: 'date_format', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：date_format(date,format)  <br>说明：对日期date格式化，格式为format<br>示例：date_format(\'2022-03-10\',\'yyyyMMdd\') => 20220310' },
    { char: 'datediff', name: 'datediff', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：datediff(enddate，startdate) <br>说明：返回结束日期减去开始日期的天数<br>示例：datediff(\'2022-03-10\',\'2022-03-05\') => 5' },
    { char: 'months_between', name: 'months_between', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：months_between(enddate，startdate) <br>说明：返回结束日期减去开始日期的月数<br>示例：months_between(\'2022-05-10\',\'2022-03-15\') => 1.8' },
    { char: 'last_day', name: 'last_day', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 1, quota: 1, attribute: 1, field: 1, desc: '语法：last_day(enddate)  <br>说明：获取某个日期所在月份最后一天的日期<br>示例：last_day(\'2022-03-10\') => 2022-03-31' },
    { char: 'to_date', name: 'to_date', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 1, quota: 1, attribute: 1, field: 1, desc: '语法：to_date(timestamp)   <br>说明：返回日期时间字段中的日期部分<br>示例：to_date(\'2022-03-10 10:03:01\') => 2022-03-10' },
    { char: 'date2datekey', name: 'date2datekey', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 1, quota: 1, attribute: 1, field: 1, desc: '语法：date2datekey(date)  <br>说明：日期转换，y-M-d转换为yMd格式<br>示例：date2datekey(\'2022-03-10\') => 20220310' },
    { char: 'datekey2date', name: 'datekey2date', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 1, quota: 1, attribute: 1, field: 1, desc: '语法：datekey2date(date)  <br>说明：日期转换，yMd转换为y-M-d格式<br>示例：datekey2date(\'20220310\') => 2022-03-10' },
    { char: 'trunc', name: 'trunc', layoutType: 'date', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：trunc(date,pattern)  <br>说明：截取某部分的日期，其他部分默认为01<br>示例：trunc(\'2022-03-10\',\'MM\') => 2022-03-01' },

    // { char: '取日期', name: 'day', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1 },
    // { char: '月份差值', name: 'months_between', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1 },
    // { char: '取月份', name: 'month', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1 },
    // { char: '取年份', name: 'year', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1 },
    // { char: '日期转时间戳', name: 'unix_timestamp', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1 },
    // { char: '时间戳转日期', name: 'from_unixtime', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1 },
    // { char: '月份第一天', name: 'mtFirstDayOfMonth', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1 },
    
    { char: 'coalesce', name: 'coalesce', layoutType: 'other', category: 'method', renderType: 'dynamicParams', paramsType: 'dynamic-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：coalesce(v1, v2, …)  <br>说明：返回参数中的第一个非空值；如果所有值都为NULL，那么返回NULL<br>示例：coalesce(null,1) => 1' },
    { char: 'substring', name: 'substring', layoutType: 'other', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 3, quota: 1, attribute: 1, field: 1, desc: '语法：substring(string，start，length)  <br>说明：获取字符串string从start位置开始，长度length的子串<br>示例：substring(\'abcdefg\',2,2) => \'bc\'' },
    { char: 'concat', name: 'concat', layoutType: 'other', category: 'method', renderType: 'dynamicParams', paramsType: 'dynamic-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：concat(string1，string2，.... stringN) <br>说明：把N个字符串拼接在一起<br>示例：concat(1,\'a\') => \'1a\'' },
    { char: 'cast', name: 'cast', layoutType: 'other', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：cast(expr as &lt;type&gt;)<br>说明：返回转换后的数据类型<br>示例：cast(1 as bigint)' },
    { char: 'like', name: 'like', layoutType: 'other', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：like x <br>说明：模糊匹配，字符”%”表示任意数量的字符' },
    { char: 'not like', name: 'not-like', layoutType: 'other', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', quota: 1, attribute: 1, field: 1, desc: '语法：not like x <br>说明：模糊匹配，字符”%”表示任意数量的字符' },
    { char: 'between', name: 'between', layoutType: 'other', category: 'method', renderType: 'fixedParams', paramsType: 'fix-params-method', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：a between x and y <br>说明：判断a是否在x到y之间' },
    { char: 'if(...)', name: 'if', layoutType: 'other', category: 'if', renderType: 'fixedParams', paramsType: 'if', paramAmount: 3, quota: 1, attribute: 1, field: 1, exportChar: '条件判断', desc: '语法：if（testCondition，valueTrue，valueFalseOrNull） <br>说明：当条件testCondition为TRUE时，返回valueTrue；否则返回valueFalseOrNull' },
    { char: 'case(...)', name: 'case', layoutType: 'other', category: 'case', renderType: 'case', paramsType: 'case', quota: 1, attribute: 1, field: 1, desc: '语法：case a when b then c [when d then e]* [else f] end <br>说明：如果a等于b，那么返回c；如果a等于d，那么返回e；否则返回f' },
    { char: '且', name: "and", layoutType: 'other', category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '且', desc: 'sql中替换为 and' },
    { char: '或', name: "or", layoutType: 'other', category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '或', desc: 'sql中替换为 or' },
    { char: '属于', name: 'in', layoutType: 'other', category: 'method', renderType: 'dynamicParams', paramsType: 'dynamic-params-method', quota: 1, attribute: 1, field: 1, desc: 'in (x， y，...）  <br>说明：判断一个元素是否在某个列表中' },
    { char: '当前日期', name: 'current_date', value: 'current_date', layoutType: 'other', category: 'constant', renderType: 'tag', paramsType: 'system', quota: 1, attribute: 1, field: 1, exportChar: 'current_date', desc: '系统值：使用系统当前日期，对应变量current_date' },
    { char: '当前时间戳', name: 'current_timestamp', value: 'current_timestamp', layoutType: 'other', category: 'constant', renderType: 'tag', paramsType: 'system', quota: 1, attribute: 1, field: 1, exportChar: 'current_timestamp', desc: '系统值：获取系统当前时间戳，对应变量current_timestamp' },
    { char: '空字符', name: 'empty-value', value: 'empty-value', layoutType: 'other', category: 'constant', renderType: 'tag', paramsType: 'system', quota: 1, attribute: 1, field: 1, exportChar: "''", desc: '空字符串，sql语句替换为""' },
    { char: 'null', name: 'null-value', value: 'null-value', layoutType: 'other', category: 'constant', renderType: 'tag', paramsType: 'system', quota: 1, attribute: 1, field: 1, exportChar: 'NULL', desc: 'null，sql语句替换为null' },
    { char: '不为空', name: "is-not-null", layoutType: 'other', category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '不为空', desc: 'sql中替换为 is not null' },
    { char: '为空', name: "is-null", layoutType: 'other', category: 'operator', renderType: 'text', paramsType: 'operator', quota: 1, attribute: 1, field: 1, exportChar: '为空', desc: 'sql中替换为 is null' },

    { char: 'bigint', name: 'bigint', layoutType: 'type', category: 'dataType', renderType: 'text', paramsType: 'data-type', quota: 1, attribute: 1, field: 1, exportChar: 'bigint', },
    { char: 'string', name: 'string', layoutType: 'type', category: 'dataType', renderType: 'text', paramsType: 'data-type', quota: 1, attribute: 1, field: 1, exportChar: 'string', },
    { char: 'double', name: 'double', layoutType: 'type', category: 'dataType', renderType: 'text', paramsType: 'data-type', quota: 1, attribute: 1, field: 1, exportChar: 'double', },
    { char: 'decimal', name: 'decimal', layoutType: 'type', category: 'method', renderType: 'fixedParams', paramsType: 'data-type', paramAmount: 2, quota: 1, attribute: 1, field: 1, desc: '语法：decimal(precision,scale) <br>说明：小数点类型，precision表示精确到几位数字，scale表示几位小数部分'}


  ]
}