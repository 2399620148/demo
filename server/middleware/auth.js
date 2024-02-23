/**
 * 进行鉴权和授权
 */
import { nanoid } from 'nanoid';
import {getCookieExpires, sign, unsign} from '~/server/utils/index';

// 不需要进行校验的名单
const unlessAuthList = [
  /^\/api\/images/,
  /^\/api\/jiangxi/,
  /^\/api\/fujian/
];

function checkNeedAuth (path) {
  const res =  unlessAuthList.some(function(p) {
    return (typeof p === 'string' && p === path) ||
      (p instanceof RegExp && !! p.exec(path));
  });
  return !res;
}

// 判断是否是userId格式
function getObjectId (str) {
  if(str.length !== 30) {
    return false;
  }
  const arr = str.split('|');
  if(!arr[1] || arr[1].length !== 5) {
    return false;
  }
  if(/^[0-9A-F]{24}$/i.test(arr[0])) {
    return arr[0]
  }
  return false;
}

export default defineEventHandler( async (event) => {
  const redis = event.context.redis;
  // const cookies = parseCookies(event)
  // console.log(cookies);

  const sid = getCookie(event, 'sid');
  const verifyId = sid ? unsign(sid) : null;
  let userInfo;
  const reqPath = event.node.req.url;

  // 如果浏览器没有sid,或者sid不合规，重新生成sid
  if(!sid || !verifyId) {
    const newSid = sign(nanoid(30));
    const expires = getCookieExpires(1);
    setCookie(event, 'sid', newSid, {
      httpOnly: true,
      path: '/',
      expires: expires
    })
  } else {
    const userId = getObjectId(verifyId);
    if(userId) {
      
      // 从redis中获取userInfo
      userInfo = await redis.hgetall(`user:${userId}`);

      // console.log('redis userInfo', userInfo)

      // 从redis中成功获取userInfo
      if(userInfo && userInfo._id) {
        event.context.user = userInfo;
        event.context.userId = userId;
      } else {
        // 获取失败，重新sid
        const newSid = sign(nanoid(30));
        const expires = getCookieExpires(1);
        setCookie(event, 'sid', newSid, {
          httpOnly: true,
          path: '/',
          expires: expires
        })
      }
    }
  }

  if(reqPath.indexOf('/api') === 0) {
    const needAuth = checkNeedAuth(reqPath);
    if(needAuth && !userInfo) {
      return event.context.error('Unauthorized')
    }
  }

})