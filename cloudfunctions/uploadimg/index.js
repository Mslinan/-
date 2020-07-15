// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xly-gio63'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let {base64Data} = event
  return await cloud.uploadFile({
    cloudPath: 'images/' + Date.now() + '.png',
    fileContent: Buffer.from(base64Data, 'base64'),   // 只能是buffer或者文件流格式
  })
}