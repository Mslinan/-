const {toBase64, unload, find, callfun} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    imgArr: [], // 上传图片的数组
    recipeType: [], // 分类菜谱
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCate()
  },
  // 提交的表单信息
  async submit (e) {
    wx.showLoading({
      title: '正在上传中...',
      mask: true,
    });
    //1. 图片格式转换
    const base64Arr = await toBase64(this.data.imgArr)
    // console.log(base64Arr)
    // 2.上传图片
    const fileId = await unload(base64Arr)
    // 3. 拿到表单数据
    const formData = e.detail.value
    // 4. 上传到数据库
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    callfun('add', {
      collectionName: 'recpies',
      data: {
        _openid: openid,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        recipeName: formData.recipeName,
        recipeTypeid: formData.recipeTypeid,
        recipesMake: formData.recipesMake,
        recipesPic: fileId,
        rmcp: 0,
        tjcp: 0
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '上传成功',
        mask: true,
      }); 
      // 跳转回个人中心
      wx.navigateBack({
        delta: 1
      }); 
    })
  },
  // 上传图片
  uploadImg () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        this.setData({
          imgArr: [...this.data.imgArr, ...tempFilePaths]
        })
        // console.log(this.data.imgArr)
      }
    })
  },
  // 获取分类菜谱
  async getCate () {
    const res = await find('recipeType')
    // console.log(res)
    this.setData({
      recipeType: res.data
    })
    // console.log(this.data.recipeType)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  }
})