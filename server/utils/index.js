/**
 * 工具类
 */
import crypto from 'crypto';
let { env, salt, aliyunId, aliyunSecret } = useRuntimeConfig();

/**
 * 获取随机数字
 * @param length
 * @returns {string}
 */
export const randomNumber = (length) => {
  var str = ''
    , maxLength = parseInt(length) || 6
    , chars = '0123456789';
  while (str.length !== maxLength) {
    var random = Math.floor(Math.random() * chars.length);
    str += chars[random];
  }
  return str;
};


export function addNumber(num1, num2, fixLen = 2) {
  num1 = num1 || 0;
  num2 = num2 || 0;
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  let ret = (num1 * baseNum + num2 * baseNum) / baseNum;
  if (ret.toString().length > 5) {
      ret = ret.toFixed(fixLen);
      ret = Number(ret) || 0;
  }
  return ret;
}


/**
 * 检查密码强度
 * @param {*} sValue 
 * @returns 
 */
export const checkStrong = (sValue) => {
  var modes = 0;
  //正则表达式验证符合要求的
  if (sValue.length < 1) return modes;
  if (/\d/.test(sValue)) modes++; //数字
  if (/[a-z]/.test(sValue)) modes++; //小写
  if (/[A-Z]/.test(sValue)) modes++; //大写  
  if (/\W/.test(sValue)) modes++; //特殊字符

  //逻辑处理
  switch (modes) {
    case 1:
      return 1;
      break;
    case 2:
      return 2;
    case 3:
    case 4:
      return sValue.length < 12 ? 3 : 4
      break;
  }
}

export const getCookieExpires = (day = 1) => {
  const _d = new Date();
  _d.setTime(_d.getTime() + day * 24 * 60 * 60 * 1000);
  return _d
}

export const sign = (val, secret = salt) => {
  if ('string' != typeof val) throw new TypeError("Cookie value must be provided as a string.");
  if (null == secret) throw new TypeError("Secret key must be provided.");
  return val + '.' + crypto
    .createHmac('sha256', secret)
    .update(val)
    .digest('base64')
    .replace(/\=+$/, '');
};

export const unsign = (input, secret = salt) => {
  if ('string' != typeof input) throw new TypeError("Signed cookie string must be provided.");
  if (null == secret) throw new TypeError("Secret key must be provided.");
  var tentativeValue = input.slice(0, input.lastIndexOf('.')),
    expectedInput = sign(tentativeValue, secret),
    expectedBuffer = Buffer.from(expectedInput),
    inputBuffer = Buffer.from(input);
  return (
    expectedBuffer.length === inputBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, inputBuffer)
  ) ? tentativeValue : false;
};

export const md5 = (str) => {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}

export const isUrl = (str) => {
  const v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
  return v.test(str);
}

export const pick = (obj, fields) => {
  const result = {};
  fields.map(item => {
    if (typeof obj[item] !== "undefined") {
      result[item] = obj[item]
    }
  })
  return result;
}

// 随机从数组中获取几个
export const getRandomFromArray = function (arr, num) {
  const seed = [];
  const length = arr.length;
  for (var i = 0; i < length; i++) {
    seed[i] = i;
  }
  const ret = [];
  for (var i = 0; i < num; i++) {
    const r = Math.floor(Math.random() * (length - i)) + i;
    ret[i] = arr[seed[r]];
    seed[r] = seed[i];
  }
  return ret;
};

// 延迟多少毫秒
export const sleep = async function (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time)
  })
}