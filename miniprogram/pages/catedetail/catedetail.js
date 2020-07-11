// pages/detail/detail.js
const {find} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: [], // 当前页的菜谱
    page: 1, // 当前页码
  },
  // 跳转详情页
  toDeatil (e) {
    // console.log(e)
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    });
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const {id, title} = options
    this.setData({
      id
    })
    wx.setNavigationBarTitle({
      title: title
    });
    this.getcateDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  // 获取数据
  async getcateDetail () {
    let {id,page} = this.data
    let res
    if (id === '1') {
      // 点击了推荐菜谱
      res = await find('recpies',{},5,'tjcp','desc',(page-1)*5)
    }
    else if (id === '2') {
      // 点击了热门菜谱
      res = await find('recpies',{},5,'rmcp','desc',(page-1)*5)
    }else {
      // 点击了其他菜谱
      res = await find('recpies',{recipeTypeid: id},5,'rmcp','desc',(page-1)*5)
    }
    
    this.setData({
      list: [...this.data.list,...res.data]
    })
    if(res.data.length === 0) {
      // 没有数据
      wx.showToast({
        title: '暂无更多数据',
      });   
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page
    page++
    this.setData({
      page
    })
    this.getcateDetail()
  },
})