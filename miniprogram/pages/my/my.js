// miniprogram/pages/my/my.js
const {callfun, find, showModal} = require('../../request/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    userInfo: {},
    page: 1,
    attentionList: [], // 关注列表
    caidanList: [], // 菜单列表
    caipuList: [], // 菜谱列表
    calcHeight: 375 + 'rpx',
  },
  // 获取关注列表
  async getAttention () {
    const openid = wx.getStorageSync('openid');
    const page = this.data.page
    const res = await find('recipeGuanzhu', {openid: openid},5,'rmcp','desc',(page-1)*5)
    // 关注列表
    const list = res.data
    let attentionList = []
    for (let i = 0; i < list.length; i++) {
      const attentionItem = await find('recpies', {_id: list[i].recipeid})
      attentionList.push(attentionItem.data[0])
    }   
    // console.log(attentionList) 
    this.setData({
      attentionList: [...this.data.attentionList,...attentionList],
      // 计算高度
      calcHeight: [...this.data.attentionList,...attentionList].length * 350 + 100 + 'rpx'
    })
    console.log(this.data.attentionList)
    if(attentionList.length === 0) {
      // 没有数据
      wx.showToast({
        title: '暂无更多数据',
      });   
    }
  },
  // 获取菜单列表
  async getCaidan () {
    // 根据openid来获取属于自己的菜单
    const openid = wx.getStorageSync('openid');
    let page = this.data.page
    const caidanList = await find('recpies', {
      _openid: openid
    },5,'rmcp','desc',(page-1)*5)
    // console.log(caidanList)
    this.setData({
      caidanList: [...this.data.caidanList,...caidanList.data],
      // 计算高度
      calcHeight: [...this.data.caidanList,...caidanList.data].length * 382 + 100 + 'rpx'
    })
    // console.log(caidanList.data)
    if(caidanList.data.length === 0) {
      // 没有数据
      wx.showToast({
        title: '暂无更多数据',
      });   
    } 
  },
  // 获取菜谱列表
  async getCaipu () {
    const openid = wx.getStorageSync('openid');
    const res = await find('recpies', {
      _openid: openid,
    })
    // console.log(res.data)
    let recipeTypeids = []  // 我的菜谱分类集合
    res.data.forEach(item => {
      recipeTypeids.push(item.recipeTypeid)
    });
    // console.log(recipeTypeids)
    // 拿到集合以后，会有重复的，因此先去重
    const new_recipeTypeids =  this.noRepeat(recipeTypeids)
    // 去重以后，得到菜谱分类数组，接着遍历查找名称，渲染页面
    let caipuList = []
    for (let i = 0; i < new_recipeTypeids.length; i++) {
      const res = await find('recipeType', {_id: new_recipeTypeids[i]})
      caipuList.push(res.data[0])
    }
    // console.log(caipuList)
    this.setData({
      caipuList,
      calcHeight: caipuList.length * 100 + 100 + 'rpx'
    })
  },
  // 数组去重
  noRepeat(arr){
    var newArr = [];
    var myset = new Set(arr);//利用了Set结构不能接收重复数据的特点
    for(var val of myset){
        newArr.push(val)
    }
    return newArr;
  },
  // 跳转
  gocateDetail (e) {
    // console.log(e)
    const {id,title,my} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../catedetail/catedetail?id=${id}&title=${title}&my=${my}`
    });
  },
  // 获取用户信息
  async handelgetUserInfo (e) {
    // console.log(e)
    // 调用login云函数
    const res = await callfun('login')
    // console.log(res)
    const {openid} = res.result
    wx.setStorageSync('openid', openid);
    const {userInfo} = e.detail
    // 从缓存中获取用户信息
    const getuserInfo = wx.getStorageSync('userInfo')||{};
    // 判断新拿到的数据和缓存中的一样吗，一样的话直接用缓存，不一样的话更新缓存，用缓存、
    if (userInfo.nickName === getuserInfo.nickName) {
      this.setData({
        userInfo: getuserInfo
      })
    }else {
      // 将用户信息装入缓存
      wx.setStorageSync('userInfo', userInfo);
      this.setData({
        userInfo
      })
    }  
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
    if (current === 2) {
      // 调用获取关注列表函数
      this.getAttention()
    }else if (current === 0) {
      this.getCaidan()
    }else if (current === 1) {
      this.getCaipu()
    }
  },
  // 删除菜单
  async remove (e) {
    // console.log(e)
    const {id} = e.currentTarget.dataset
    // 询问要不要删除
    const res = await showModal('确定要删除此菜单吗？')
    // console.log(res)
    if (res.confirm) {
      // 根据id删除数据库中的数据,
      callfun('remove', {
        collectionName: 'recpies',
        where: {_id: id}
      }).then(res => {
        wx.showToast({
          title: '删除成功'
        });
        // 重新加载数据
        this.getCaidan()
      })
    }else if (res.cancel) {
      return
    } 
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
    wx.getSetting({
      success: (result) => {
        // 获取用户权限
        // const scope = result.authSetting["scope.userInfo"]
        // 获取用户数据
        const getuserInfo = wx.getStorageSync('userInfo')||{}
        // this.scope = scope
        this.setData({
          userInfo: getuserInfo,
        })
      }
    });
  },
  onShow () {
    this.getCaidan()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page
    const current = this.data.current
    page++
    this.setData({
      page
    })
    // ===============================
    if (current === 0) {
      this.getCaidan()
    }else if (current === 2) {
      this.getAttention()
    }
  },
})