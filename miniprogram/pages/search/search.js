// miniprogram/pages/search/search.js\
const {find} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [], //热门搜索数据
    recentList: [], // 近期搜索数据
  },
  value: '',  // 输入框
  id: '', // 搜索菜的id,
  title: '',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSearch()
    const recentList = wx.getStorageSync('recent')
    // console.log(recentList)
    this.setData({
      recentList
    })
  },
  // 输入框数据
  handelChange (e) {
    // console.log(e)
    const {value} = e.detail
    this.value = value
  },
  // 搜索
  async handelSearch () {
    const res = await find('recpies',{recipeName: this.value})
    // console.log(res)
    if (res.data.length === 0) {
      wx.showToast({
        title: '没有这个菜谱'
      });    
    }else {
      this.id = res.data[0]._id
      wx.navigateTo({
        url: `../detail/detail?id=${this.id}`,
      }); 
      this.handelrecent(this.value)
    }
      
  },
  // 查询热门搜索
  async getHotSearch () {
    const res = await find('recpies',{},9)
    // console.log(res)
    this.setData({
      hotList: res.data
    })
  },
  // 跳转详情页
  toDeatil (e) {
    // console.log(e)
    const {id,title} = e.currentTarget.dataset
    this.title = title
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    });
    this.handelrecent(title)
    // console.log(this.data.recentList)
  },
  // 处理最近搜索
  handelrecent (query) {
    const recentList = wx.getStorageSync('recent')||[]
    // const title = this.title
    // 先判断缓存中有没有这个菜，如果没有直接加，有就先删除之前加的，在加现在家的，保证最近搜索在前
    const index = recentList.findIndex(item => item === query)
    if (index === -1) {  // 没有
      recentList.unshift(query)
    }else {  // 有
      recentList.splice(index, 1)
      recentList.unshift(query)
    }
    // 将数据装进缓存，代表近期搜索过的菜
    wx.setStorageSync('recent', recentList);
    this.setData({
      recentList: recentList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})