/*!
 * redis.js
 * @desc: 
 * @author: panda.club
 * @date: 2018/11/25
 */

'use strict';
import Redis from 'ioredis';
const {redisServer, redisSecret, env} = useRuntimeConfig();

let redisClient = new Redis({
  "host": redisServer,
  "port": "6379",
  "password": redisSecret
});

redisClient.on('connect', () => {
  // console.log(redisServer);
  console.log('redis connect success ....')
})
redisClient.on('error', (err) => {
  console.error(err);
  console.log('redis connect error ....')
})

// define a custom command called lock
redisClient.defineCommand('lock', {
  numberOfKeys: 3,
  lua: `
    local key = KEYS[1]
    local uuid = KEYS[2]
    local timeout = KEYS[3]
    local result = redis.call('SET', key, uuid, 'PX', timeout, 'NX')
    if result then
      return 1
    else
      return 0
    end
  `
});

// define a custom command called unlock
redisClient.defineCommand('unlock', {
  numberOfKeys: 2,
  lua: `
    local key = KEYS[1]
    local uuid = KEYS[2]
    if redis.call('GET', key) == uuid then
      return redis.call('DEL', key)
    else
      return 0
    end
  `
});

function isObject (value) {
  return Object.prototype.toString.call(value) === "[object Object]"
}

function isArray (value) {
  return Array.isArray(value)
}

function parseJson (value) {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

/**
 * hsetJson , 将json结构数据和array结构转string
 * @param {*} key 
 * @param {*} params 
 */
redisClient.hsetJson = async function (key, params) {
  let payload = {};
  for(var i in params) {
    if(params[i]) {
      if(isObject(params[i]) || isArray(params[i])) {
        payload[i] = JSON.stringify(params[i])
      } else {
        payload[i] = params[i]
      }
    }
  }
  const res = await redisClient.hset(key, payload);
  return res;
}


/**
 * hgetJson , 将json结构数据和array结构转string
 * @param {*} key 
 * @param {*} params 
 */
redisClient.hgetJson = async function (key, fields = []) {
  const res = await redisClient.hgetall(key);
  if(fields && fields.length > 0) {
    fields.map(field => {
      res[field] = parseJson(res[field])
    })
  } else {
    for(var i in res) {
      res[i] = parseJson(res[i])
    }
  }
  return res;
}

redisClient.setAsync = async function (key, value, expire) {
  if(typeof value === 'object') {
    value = JSON.stringify(value)
  }
  if(!expire) {
    const res = await redisClient.set(key, value);
    return res;
  } else {
    const res = await redisClient.set(key, value, 'EX', parseInt(expire));
    return res;
  }
}

// 返回json结构
redisClient.getAsyncJson = async function (key) {
  const res = await redisClient.get(key);
  if(!res) {
    return null;
  }
  try {
    if (typeof JSON.parse(res) == "object") {
      return JSON.parse(res);
    }
  } catch(e) {
    return res;
  }
}


export default defineEventHandler((event) => {
  event.context.redis = redisClient
})