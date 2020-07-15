// miniprogram/pages/detail/detail.js
const {find, callfun} = require('../../request/index')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', // 菜id
    detail: {}, // 菜详情对象
    isAttention: false, // 是否关注
    tjcp: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const {id} = options
    this.setData({
      id
    })
    this.views()
  },
  // 浏览量加一
  async views () {
    const id = this.data.id
    const res = await find('recpies',{_id: id})
    // 更新rmcp
    let rmcp = res.data[0].rmcp
    rmcp++
    this.update({rmcp})
    this.setData({
      rmcp
    })
  },
  // 查对应id的数据
  async getDetail () {
    const id = this.data.id
    const res = await find('recpies',{_id: id})
    // console.log(id)
    this.setData({
      detail: res.data[0],
      tjcp: res.data[0].tjcp
    })
  },
  // 处理关注
  handelAttention () {
    // 1. 添加数据库（包含用户openID，和菜id）
    const openid = wx.getStorageSync('openid');
    let {id,tjcp} = this.data
    // 判断是否登录
    if (openid) {
      // 2. 图标、文字要换
      this.setData({
        isAttention: !this.data.isAttention
      })
      // 2.1调用云函数，添加数据库
      callfun('add', {
        collectionName: 'recipeGuanzhu',
        data: {
          openid,
          recipeid: id
        }
      })
      // 3.更新收藏数据
      // 3.1调用云函数，更新数据库
      tjcp++
      this.update({tjcp})
      this.setData({
        tjcp
      })
    }else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });  
    }
  },
  // 取消关注
  cancelAttention () {
    // 1. 图标、文字要换
    this.setData({
      isAttention: !this.data.isAttention
    })
    // 2. 添加数据库（包含用户openID，和菜id）
    let {id,tjcp} = this.data
    // 2.1调用云函数，添加数据库
    callfun('remove', {
      collectionName: 'recipeGuanzhu',
      where: {
        recipeid: id
      }
    })
    // 3.更新收藏数据
    // 3.1调用云函数，更新数据库
    tjcp--
    this.update({tjcp})
    this.setData({
      tjcp
    })
  },
  // 封装更新数据
  update (arg) {
    let {id} = this.data
    callfun('update', {
      collectionName: 'recpies',
      where: {_id: id},
      data: arg
    })
  },
  // 检测是否关注
  async checkisAttention () {
    const {id} = this.data
    const res = await find('recipeGuanzhu',{recipeid: id})
    if (res.data.length !== 0) {
      // 存在关注表中，已关注
      this.setData({
        isAttention: true
      })
    }
  },
  // 点击预览大图
  previewImage (e) {
    const {index} = e.currentTarget.dataset
    // console.log(index)
    // 1.构造urls数组（需要显示图片的地址链接的数组）
    const urls = this.data.detail.recipesPic
    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail()
    this.checkisAttention()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
})