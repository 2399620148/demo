import dayjs from "dayjs";
const { encryptURL, decryptURL } = useRuntimeConfig();

/**
 * 上传pin
 * @param {*} ctx 
 * @param {*} body 
 * @returns 
 */
const appId = '640164b815339df4f9737ed2';
const appToken = '4830d017-562f-4750-bfdc-bb86766219e1';
const appPushURL = 'https://gldev.cetset.com:20060/third-interface/fjzf/pushBmData';
// const subjectNameMap = {
//   '65b21ece442f35146dd4df3d': "综合法律知识考试",
//   '65b21f09442f35146dd4e314': "乡镇专业法律知识考试",
//   '65b21f37442f35146dd4e48e': "司法行政专业法律知识考试"
// }

const examIds = ['65b21ece442f35146dd4df3d', '65b21f09442f35146dd4e314', '65b21f37442f35146dd4e48e']
// const examIdsNormal = ['65b76d68a42953feac4ddde8', '65b76d37a42953feac4ddc51', '65b76ceaa42953feac4dd9ed']

export default defineEventHandler(async (event) => {
  const ctx = event.context;
  const body = await readBody(event);
  try {
    const {
      db,
      dbExam,
      redis,
    } = ctx;

    let {
      memberId,
      examId
    } = body;


    if (!memberId || !examId || !examIds.includes(examId)) {
      return ctx.error('参数错误！')
    }
    const myexamInfo = await dbExam.collection('myexam').where({
      memberId, examId
    }).getOne();
    // 处理数据
    if(!myexamInfo){
      console.log('fujian:syncMember:学员信息同步失败！')
      return ctx.error('学员信息同步失败！')
    }
    if (myexamInfo && myexamInfo.synced == 2) {
      console.log('fujian:syncMember:学员信息已同步！')
      return ctx.error('学员信息已同步！')
    }
    const myexamId= myexamInfo.id;
    const memberInfo = await db.collection('member').doc(memberId).get();
    if (!memberInfo) {
      console.log('fujian:syncMember:找不到学员信息！')
      return ctx.error('找不到学员信息！')
    }
    const { realname, idcard, mobile, photo, extends: extendInfo = {} } = memberInfo;

    const payload = {
      name: realname,
      sex: extendInfo.gender === '男' ? '0' : '1',
      cardNumber: idcard,
      phone: mobile,
      photo: photo,
      cardType: '0',
      subjectName: examId
    }
    // 加密
    const str = await $fetch(encryptURL, {
      method: 'POST',
      body: payload
    });
    console.log(payload, str)

    const asyncData = {
      "key": appToken,
      "list": [str]
    }
    const startTime = new Date().getTime();
    // 同步
    const result = await $fetch(appPushURL, {
      method: 'POST',
      body: asyncData
    });
    if (!result || result.code !== '20000') {
      console.log('fujian:syncMember:同步失败！')
      return ctx.error('同步失败！')
    } else {
      const { state } = result.list[0];
      if (state !== '1') {
        console.log(state, '同步失败!')
        return ctx.error('同步失败！')
      }
    }

    const endTime = dayjs();
    const pushrecordData = {
      type: 'task',
      memberId, appId, productId: examId, startTime, endTime: endTime.valueOf(), retry: 0, date: endTime.format('YYYYMMDD'),
      status: (result && result.code === 0) ? 0 : 1,
      result: JSON.stringify({ code: result.code }),
      content: ''
    }
    await db.collection('pushrecord').add({
      data: pushrecordData
    })

    const { state, stateDesc } = result.list[0]
    if (state === '1') {
      // 更新myexam.synced == 2
      await dbExam.collection('myexam').doc(myexamId).update({
        data: {
          $set: {
            synced: 2
          }
        }
      })
      console.log('fujian:syncMember:同步成功！')
      return ctx.success('同步成功！')
    } else {
      console.log(`fujian:syncMember:同步信息失败！ ${stateDesc}`)
      return ctx.error(stateDesc || '同步信息失败！')
    }
  } catch (err) {
    console.log(err)
    return ctx.error(err);
  }
})