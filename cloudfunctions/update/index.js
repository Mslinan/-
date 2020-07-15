// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xly-gio63'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  // 外界传入的参数，在event中
  let {data, collectionName,where} = event
  return new Promise((resolve, reject) => {
    db.collection(collectionName).where(where).update({
      data
    })
    .then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}