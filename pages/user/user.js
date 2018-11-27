var app = getApp();
Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasAddress: false,
    address: {},
    funsCount: 20,
    isLogin: false,
    isTuanZhang: false
  },
  onLoad() {
    var self = this;
    if (app.globalData.openID) {
      this.query()
    } else {
      app.getToken().then((resArg) => {
        self.query();
      })
    }
  },

  onShow(){
    var self = this;
    if (app.globalData.openID) {
      this.query()
    } else {
      app.getToken().then((resArg) => {
        self.query();
      })
    }
  },

  query() {
    let self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/tuan/isTuanZhang?id=" + app.globalData.openID, //给函数传递服务器地址参数
      data: {}, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('isTuanzhang', res);

        self.setData({
          isTuanZhang: res.data.data[0],
        })
      },
    })
    if (app.globalData.userInfo != null) {
      this.data.isLogin = true;
      this.setData({
        isLogin: true,
      })
    }
  },

  showOrder: function(e) {
    var type = e.currentTarget.dataset.type
    app.redirect('orders/index', 'id=' + type)
  },

  //商铺管理
  shopManage() {
    app.redirect('shopManage/shopManage')
  },
  //我的粉丝
  showFuns() {
    app.redirect('funsManage/funsManage')
  },
  //商铺订单详情
  showShopOrder() {
    app.redirect('shopOrder/shopOrder')
  },
  //兑换福利
  welfare() {
    app.redirect('welfare/welfare')
  },
  //我的佣金
  showCommission() {
    app.redirect('commission/commission')
  },
  //关于我们
  aboutUS() {
    app.redirect('aboutUs/aboutUs')
  },
  groupOwner() {
    app.redirect('groupOwner/groupOwner')
  },
  bindGetUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      isLogin: true,
    })
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/terminaluser/add", //给函数传递服务器地址参数
      data: {
        id: app.globalData.openID,
        name: e.detail.userInfo.nickName,
        image: e.detail.userInfo.avatarUrl
      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('userInfo-success', res);
      },
    })
  }
})