
// async function _getList(type, apiPath = 'terms') {
//   const findResult = await $fetch("/api/admin/" + apiPath, {
//     method: "POST",
//     body: {
//       action: "getList",
//       page: 1,
//       pageSize: 1000,
//       ...(type ? { type } : {})
//     },
//   });
//   return findResult.data.list || []
// }

// export const userTermList = () => {
//   return useState('termList', _getList)
// }

// export const userTermNameMap = async (type, apiPath = 'terms') => {
//   const nameMap = {};
//   const list = await _getList(type, apiPath)
//   const optionsList = list.map(item => {
//     nameMap[item.id] = item.name || item.title;
//     return
//   })
//   return { nameMap, optionsList }
// }