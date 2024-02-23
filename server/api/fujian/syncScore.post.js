const { encryptURL, decryptURL } = useRuntimeConfig();
import dayjs from "dayjs";

/**
 * 上传pin
 * @param {*} ctx 
 * @param {*} body 
 * @returns 
 */
const appId = '640164b815339df4f9737ed2';
const appToken = '4830d017-562f-4750-bfdc-bb86766219e1';
// const examIds = {  // 模拟 -> 对应更新正式
//   '65b21ece442f35146dd4df3d': "综合法律知识考试",
//   '65b21f09442f35146dd4e314': "乡镇专业法律知识考试",
//   '65b21f37442f35146dd4e48e': "司法行政专业法律知识考试"
// }

const subjectNameMap = {
  "65b21ece442f35146dd4df3d": '65b76d68a42953feac4ddde8',
  "65b21f09442f35146dd4e314": '65b76d37a42953feac4ddc51',
  "65b21f37442f35146dd4e48e": '65b76ceaa42953feac4dd9ed',
}

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
      appkey,
      list
    } = body;

    if (appkey !== appToken) {
      return ctx.body = {
        code: '20002',
        data: [
          {
            success: false,
            message: 'appkey错误！'
          }
        ]
      }
    }

    if (!Array.isArray(list)) {
      return ctx.body = {
        code: '20002',
        data: [
          {
            success: false,
            message: '请求参数错误！'
          }
        ]
      }
    }
    const { data } = list[0];

    console.log(data)
    // 解密
    const userInfo = await $fetch(decryptURL, {
      method: 'POST',
      body: {
        key: '1111111111',
        data
      }
    });

    console.log(userInfo, 'decrypt_____')

    const { idCard, isPassed, score, status, subjectName } = userInfo;
    if (!idCard || score === undefined || !subjectName) {
      return ctx.body = {
        code: '20002',
        data: [
          {
            idCard,
            success: false,
            message: '同步数据字段错误！'
          }
        ]
      }
    }

    // 处理数据
    const memberInfo = await db.collection('member').where({ appId, idcard: '620102198106222454' }).getOne()
    if (!memberInfo) {
      return ctx.body = {
        code: '20002',
        data: [
          {
            idCard,
            success: false,
            message: '找不到学员信息！'
          }
        ]
      }
    }

    const { id: memberId, termId, memberClass } = memberInfo;


    const examId = subjectNameMap[subjectName] || '65b76ceaa42953feac4dd9ed';
    if (!examId) {
      return ctx.body = {
        code: '20002',
        data: [
          {
            idCard,
            success: false,
            message: '正式考试信息匹配不到！'
          }
        ]
      }
    }

    const myexamResult = await dbExam.collection('myexam').where({ examId, memberId: memberInfo.id }).getOne();
    let myexamData;
    if (!myexamResult) {
      myexamData = await dbExam.collection('myexam').add({
        data: {
          startTime: dayjs().format(),
          examId,
          memberId,
          appId,
          termId,
          memberClass,
          status: 2,
          synced: 2,
          state: 1,
          normalNumber: 1,
          isPassed,
          endScore: score
        }
      })
    } else {
      myexamData = await dbExam.collection('myexam').where({ examId, memberId: memberInfo.id }).update({
        data: {
          $set: {
            isPassed,
            endScore: score
          }
        }
      })
    }

    const syncSuccess = !!myexamData.data;
    console.log(`fujian:syncScore:${syncSuccess ? '同步成功！' : '同步失败'}`)

    return ctx.body = {
      code: '20000',
      data: [
        {
          idCard,
          success: syncSuccess,
          message: syncSuccess ? '同步成功！' : '同步失败'
        }
      ]
    }

  } catch (err) {
    console.log(err)
    return ctx.body = {
      code: '20002',
      data: [
        {
          idCard,
          success: false,
          message: JSON.stringify(err)
        }
      ]
    }
  }
})