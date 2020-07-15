

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
// 封装云函数调用
export const callfun = (name, data={}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 图片转base64
export const toBase64 = (imgArr) => {
  return new Promise((resolve, reject) => {
    let base64Arr = []
    if (imgArr.length) {
      imgArr.forEach(item => {
        wx.getFileSystemManager().readFile({
          filePath: item,
          encoding: 'base64',
          success: res => {
            // console.log(res)
            base64Arr.push(res.data)
            if (base64Arr.length >= imgArr.length) {
              resolve(base64Arr)
            }
          }
        })
      }) 
    }else {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none',
      });   
    }   
  })
}

// 调用云函数上传图片到云存储
export const unload = (base64Arr) => {
  return new Promise((resolve, reject) => {
    let fileIdArr = []
    base64Arr.forEach(item => {
      callfun('uploadimg', {base64Data: item}).then(res => {
        // console.log(res.result.fileID)
        fileIdArr.push(res.result.fileID)
        if (fileIdArr.length >= base64Arr.length) {
          resolve(fileIdArr)
        }
      })
    })
  })
}


// 是否删除询问
export const showModal = (content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

