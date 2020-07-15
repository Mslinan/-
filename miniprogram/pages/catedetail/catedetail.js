const {find} = require('../../request/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: [], // 当前页的菜谱
    page: 1, // 当前页码
    my: '', //是否查看我的菜谱标识
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
    const {id, title, my} = options
    this.setData({
      id,
      my
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
      this.setData({
        list: [...this.data.list,...res.data]
      })
    }
    else if (id === '2') {
      // 点击了热门菜谱
      res = await find('recpies',{},5,'rmcp','desc',(page-1)*5)
      this.setData({
        list: [...this.data.list,...res.data]
      })
    }else {
      // 点击了其他菜谱
      const openid = wx.getStorageSync('openid');
      res = await find('recpies',{recipeTypeid: id},5,'rmcp','desc',(page-1)*5)
      // console.log(this.data.my)
      // 如果my 有值，则显示我的菜谱，没有值就全部显示
      const my = this.data.my
      let myList = []  // 定义我的菜谱
      res.data.forEach(item => {  // 找到我的菜谱
        if (item._openid === openid) {
          // 是我自己的菜谱
          myList.push(item)
        }
      })
      // console.log(myList)
      // 判断my有没有值
      if (my === 'my') {
        this.setData({
          list: [...myList]
        })
      } else {
        this.setData({
          list: [...this.data.list,...res.data]
        })
      }
    }
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