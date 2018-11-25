var app = getApp();
Page({
  data: {
    titlePictures: [],
    quickSell: [],
    commonSell: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  onPullDownRefresh: function() {

    this.queryList()
  },
  onLoad: function() {
    var self = this;
    if (app.globalData.openID){
      this.queryList()
    }else{
      app.getToken().then((resArg) => {
        self.queryList();
      })
    }
  },
  
  queryList() {
    var self = this;
    //首页滚动
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/homeimgs/getList", //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('title', res);
        self.setData({
          titlePictures: res.data.data,
        })
      },
    })
    //首页产品信息
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/goods/getList4WxApp", //给函数传递服务器地址参数 
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log("common", res); //打印出返回的数据
        self.setData({
          commonSell: res.data.data
        })
      },
    })
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/seckillplan/getList4WxApp", //给函数传递服务器地址参数 
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log("secKill", res); //打印出返回的数据

        self.setData({
          quickSell: res.data.data
        })
      },
    })
  },
  seckill: function(e) {
    var id = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../details/seckillDetails/seckillDetails?id=' + id
    })
  },
  commonBuy: function(e) {
    var id = e.currentTarget.dataset.productid;
    wx.navigateTo({
      url: '../details/commonDetails/commonDetails?id=' + id
    })
  },

})