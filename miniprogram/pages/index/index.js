// miniprogram/pages/index/index.js
const {find, _} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [], 
    getlist: [],//查询到的儿童菜谱和养生菜谱
  },
  id: '', // 点击菜谱的id
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  onLoad () {
    this.getHotList()
    this.getlist()
  },
  // 跳转详情页
  toDeatil (e) {
    // console.log(e)
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    });
      
  },
  // 请求首页菜谱
  async getHotList () {
    const res = await find('recpies')
    // console.log(res.data)
    this.setData({
      hotList: res.data
    })
  },
  // 获取儿童菜谱或者养生菜谱
  async getlist () {
    const res = await find('recipeType',
      _.or([{recipeTypeName: '儿童菜谱'}, {recipeTypeName: '养生菜谱'}]),
    )
    this.setData({
      getlist: res.data
    })
  },
  // 去儿童菜谱或者养生菜谱
  async tocp (e) {
    const {id,title} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../catedetail/catedetail?id=${id}&title=${title}`
    });   
  }
})