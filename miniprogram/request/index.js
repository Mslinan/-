// 封装请求数据库
const db = wx.cloud.database()
export const _ = db.command
// 1.查询
export const find = (dbName,where={},limit=20,targetName='rmcp',sort='desc',skip=0) => {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  });
    
  return new Promise((resolve, reject) => {
    db.collection(dbName).where(where).limit(limit).orderBy(targetName,sort).skip(skip)
    .get().then(res => {
      resolve(res)
      wx.hideLoading();
    }).catch(err => {
      reject(err)
    })
  })
}

