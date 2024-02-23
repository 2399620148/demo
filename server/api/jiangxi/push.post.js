import { addNumber, sleep } from "~/server/utils";
import dayjs from "dayjs";

/**
 * 上传pin
 * @param {*} ctx 
 * @param {*} body 
 * @returns 
 */
const jiangxiToken = '4b6b76a753b953481d9ff57f4be8cf05';
const jiangxiPushURL = 'https://xzzf.jxsf.gov.cn:8443/api/api2024/updateUserScore';
const appId = '647454e62d54b9423815c3c0';

const limit = 10; //每次查10个 
/**
 * 
 * @param {*} ctx 
 * @param {*} params 
 * @returns 
 */
async function getDataList(ctx, params = {}) {
  const {
    db,
  } = ctx;
  const { year, courseConfig, lastDocId, ...payload } = params;
  if (lastDocId) {
    payload['_id'] = {$gt: lastDocId }
  }
  const yesterday = dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
  payload.updatedAt = {$gt: yesterday}
  // mytask 信息
  const mytaskResult = await db.collection('mytask').where(payload).sort({ '_id': 1 }).limit(limit).get();
  console.log(yesterday, mytaskResult.pagination, 'pagination');

  // member 信息
  const memberIds = mytaskResult.list.map(item => item.memberId)
  const memberResult = await db.collection('member').where({ _id: { $in: memberIds } }).limit(limit).get();
  const memberHash = {};
  memberResult.list.map(item => {
    const { id, idcard } = item;
    memberHash[id] = idcard;
  });

  // 组装
  const resultList = mytaskResult.list.map(item => {
    const { memberId, taskId, actions = {}, _id } = item;
    let scores = 0;
    Object.keys(actions).map(key => {
      const recordTotal = courseConfig[key];
      const { totalHour } = actions[key];
      if (recordTotal) scores = addNumber(scores, totalHour);
    });
    return {
      _id,
      id_cards: memberHash[memberId],
      productId: taskId,
      memberId,
      year,
      scores: `${scores}`
    }
  })

  return resultList
}

/**
 * 
 * @param {*} ctx 
 * @param {*} data 
 */
async function pushData(ctx, data = []) {
  const {
    db,
  } = ctx;

  for (let i = 0; i < data.length; i++) {
    const { id_cards, scores, year, memberId, productId } = data[i];
    const body = { id_cards, scores, year }
    const startTime = new Date().getTime();
    const result = await $fetch(jiangxiPushURL, {
      method: 'POST',
      body: {
        key: jiangxiToken,
        ...body,
      }
    });

    const endTime = dayjs();
    const payload = {
      type: 'task',
      memberId, appId, productId, startTime, endTime: endTime.valueOf(), retry: 0, date: endTime.format('YYYYMMDD'),
      status: (result && result.code === 0) ? 0 : 1,
      result: JSON.stringify(result),
      content: JSON.stringify(body)
    }
    await db.collection('pushrecord').add({
      data: payload
    })
  }
}

export default defineEventHandler(async (event) => {
  const ctx = event.context;
  const body = await readBody(event);
  try {
    const {
      redis,
    } = ctx;

    let {
      lastDocId = null,
      year,
      ...condition
    } = body;

    let courseConfig = null;
    if(!condition.taskId){
      condition.taskId = '6583a89f36a872aaf5e354b0'
    }
    if(!year){
      year = dayjs().year()
    }
    if (!condition.taskId) {
      return ctx.error('参数错误！')
    }
    // 处理数据
    async function _handleData() {
      // 1.从redis中查询taskInfo
      if (!courseConfig) {
        const redisKey = `taskInfo:${condition.taskId}`;
        const taskInfo = await redis.getAsyncJson(redisKey);
        if (taskInfo) {
          courseConfig = {}
          taskInfo.courseConfig.map(item => {
            courseConfig[item.id] = item.recordTotal;
          })
        }
      }
      // 2.获取数据
      const dataList = await getDataList(ctx, {
        ...condition,
        year,
        appId,
        courseConfig,
        lastDocId,
      });
      const len = dataList.length;

      // 3.同步数据
      await pushData(ctx, dataList);
      // 获取数组的最后一条数据的ID
      if (len >= limit) {
        lastDocId = dataList[len - 1]._id;
        // await sleep(3000)
        await _handleData()
      }
    }
    // 获取/处理 数据
    await _handleData();
    console.log('处理完成！！')
    return ctx.success('处理成功！')
  } catch (err) {
    console.log(err)
    return ctx.error(err);
  }
})