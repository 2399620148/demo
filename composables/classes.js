// import dayjs from 'dayjs';
// /**
//  * 
//  * @param {*} info 
//  * @param {*} classId  // 需要获取的话
//  * @returns 
//  */
// export const userClassStatus = async (info, classId) => {
//   const { $toast } = useNuxtApp();
//   const headers = useRequestHeaders(['cookie']);

//   if (classId) {
//     const result = await $fetch('/api/classes/detail', {
//       method: 'POST',
//       headers,
//       body: {
//         id: classId
//       }
//     })
//     const { status, data } = result;
//     if (status.code === 0) {
//       info = data;
//     } else {
//       $toast(status.message)
//     }
//   }
//   const { is_joined, start_time, end_time } = info;

//   if (!info) {
//     $toast.error('培训班信息错误！')
//     return { pass: false, type: 'error' };
//   }
//   if (!is_joined) {
//     $toast.error('您还未加入培训！')
//     return { pass: false, type: 'join' };
//   }
//   if (dayjs().isBefore(dayjs(start_time))) {
//     $toast.error('培训还未开始！')
//     return { pass: false, type: 'start' };
//   }
//   if (dayjs().isAfter(dayjs(end_time))) {
//     $toast.error('培训已经结束！')
//     return { pass: false, type: 'end' };
//   }
//   return { pass: true }
// }