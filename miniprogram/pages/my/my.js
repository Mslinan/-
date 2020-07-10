// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0
  },
  // 点击切换tab
  chectoutTab (e) {
    // console.log(e)
    const {index} = e.currentTarget.dataset
    this.setData({
      current: index * 1
    })
  },
  // 轮播图切换
  handelChange (e) {
    // 拿到当前的滑块
    const {current} = e.detail
    this.setData({
      current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})