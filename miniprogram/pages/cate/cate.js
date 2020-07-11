// pages/cate/cate.js
const {find} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCate()
  },
  // 获取分类菜谱
  async getCate () {
    const res = await find('recipeType')
    // console.log(res)
    this.setData({
      cateList: res.data
    })
  },
  // 跳转
  gocateDetail (e) {
    // console.log(e)
    const {id,title} = e.currentTarget.dataset
    
      
    wx.navigateTo({
      url: `../catedetail/catedetail?id=${id}&title=${title}`
    });
  }
})