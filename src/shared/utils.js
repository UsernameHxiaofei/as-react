//验证数据类型
export function typeOf (obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };

  return map[ toString.call(obj) ];
};

// 深拷贝
function deepCopy (data) {
  const type = typeOf(data);
  let object;

  if (type === 'array') {
    object = [];
  } else if (type === 'object') {
    object = {};
  } else {
    return data;
  };

  if (type === 'array') {
    for (let i = 0; i < data.length; i ++) {
      object.push(deepCopy(data[i]));
    };
  } else if (type === 'object') {
    for (let key in data) {
      object[key] = deepCopy(data[key]);
    };
  };
  return object;
};

export { deepCopy };