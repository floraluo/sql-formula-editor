export default [
  { name: 'sum', label: 'sum(col)', showName: 'sum( col)' },

  { name: 'max', label: 'max(col)', showName: 'max(col)' },

  { name: 'min', label: 'min(col)', showName: 'min(col)' },

  { name: 'count', label: 'count(col)', showName: 'count(col)' },

  { name: 'count distinct', label: 'count(distinct col)', showName: 'count(distinct col)' },

  { name: 'distinct', label: 'distinct', showName: 'distinct' },

  { name: 'round', label: 'round(DOUBLE a, INT d)', showName: 'round(a, d)' },

  { name: 'ceil', label: 'ceil(DOUBLE a)', showName: 'ceil(a)' },

  { name: 'floor', label: 'floor(DOUBLE a)', showName: 'floor(a)' },

  { name: 'abs', label: 'abs(DOUBLE a)', showName: 'abs(a)' },

  { name: 'least', label: 'least(value1, value2, ..., valueN)', showName: 'least(value1, value2, valueN)' },

  { name: 'greatest', label: 'greatest(value1, value2, ..., valueN)', showName: 'greatest(value1, value2, ..., valueN)' },

  { name: 'add_months', label: 'add_month(start_date,num_months)', showName: 'add_month(start_date,num_months)' },

  { name: 'date_add', label: 'date_add(startdate,N)', showName: 'date_add(startdate,N)' },

  { name: 'date_sub', label: 'date_sub(startdate,N)', showName: 'date_sub(startdate,N)' },

  { name: 'date_format', label: 'date_format(date,format)', showName: 'date_format(date,format)' },

  { name: 'datediff', label: 'datediff(enddate,startdate)', showName: 'datediff(enddate,startdate)' },

  { name: 'months_between', label: 'months_between(enddate,startdate)', showName: 'months_between(enddate,startdate)' },

  { name: 'last_day', label: 'last_day(date)', showName: 'last_day(date)' },

  { name: 'to_date', label: 'to_date(timestamp)', showName: 'to_date(timestamp)' },

  { name: 'date2datekey', label: 'date2datekey(date)', showName: 'date2datekey(date)' },

  { name: 'datekey2date', label: 'datekey2date(datekey)', showName: 'datekey2date(datekey)' },

  { name: 'trunc', label: 'trunc(date,pattern)', showName: 'trunc(date,pattern)' },

  { name: 'year', label: 'year(date)', showName: 'year(date)' },
  { name: 'month', label: 'month(date)', showName: 'month(date)' },
  { name: 'quarter', label: 'quarter(date)', showName: 'quarter(date)' },
  { name: 'bigint', label: 'bigint', showName: 'bigint' },

  { name: 'string', label: 'string', showName: 'string' },

  { name: 'double', label: 'double', showName: 'double' },

  { name: 'decimal', label: 'decimal(precision,scale)', showName: 'decimal(precision,scale)' },

  { name: 'coalesce', label: 'coalesce(v1, v2, ...)', showName: 'coalesce(v1, v2)' },

  { name: 'substring', label: 'substring(string,start,length)', showName: 'substring(string,start,length)' },

  { name: 'concat', label: 'concat(string1,string2,.... stringN)', showName: 'concat(string1,string2,.... stringN)' },

  { name: 'cast', label: 'cast(expr as type)', showName: 'cast(expr as type)' },

  { name: 'like', label: 'like', showName: 'like' },

  { name: 'not like', label: 'not like', showName: 'not like' },

  { name: 'between', label: 'between x and y', showName: 'between x and y' },

  { name: 'if', label: 'if(condition, valueTrue, valueFalse)', showName: 'if(condition, valueTrue, valueFalse)' },

  { name: 'case', label: 'case when a then b else e end', showName: 'case when a then b else e end' },

  { name: 'when', label: 'when', showName: 'when' },

  { name: 'when then', label: 'when a then b', showName: 'when a then b' },

  { name: 'then', label: 'then', showName: 'then' },

  { name: 'else', label: 'else', showName: 'else' },

  { name: 'end', label: 'end', showName: 'end' },

  { name: 'and', label: 'and', showName: 'and' },

  { name: 'or', label: 'or', showName: 'or' },

  { name: 'in', label: 'in', showName: 'in' },

  { name: 'not in', label: 'not in', showName: 'not in' },

  { name: 'is', label: 'is', showName: 'is' },

  { name: 'is null', label: 'is null', showName: 'is null' },

  { name: 'is not null', label: 'is not null', showName: 'is not null' },

  { name: 'current_date', label: 'current_date', showName: 'current_date' },

  { name: 'current_timestamp', label: 'current_timestamp', showName: 'current_timestamp' },

  { name: 'false', label: 'false', showName: 'false' },

  { name: 'true', label: 'true', showName: 'true' },

  { name: 'null', label: 'null', showName: 'null' },
]