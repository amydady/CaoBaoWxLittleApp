var app = getApp();
Page({
  data: {
    goodsDetail: {},
    hasCarts: false,
    goodsId: null
  },
  onLoad(options) {
    var id = options.id;
    app.globalData.shareID = options.shareid;
    var self = this;
    self.setData({
      goodsId: id
    })
    
    if (app.globalData.openID) {
      this.query()
    } else {
      app.getToken().then((resArg) => {
        self.query();
      })
    }
  },


  query() {
    var self = this;
    //查询详情
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/goods/getbyid?id=" + id, //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function (res) {
        //TO-DO 详细信息
        console.log('commonDetail', res);

        if (res.data.data[0].summaryDescription == null) {
          res.data.data[0].summaryDescription = '';
        }
        self.setData({
          goodsDetail: res.data.data[0]
        })

      },
    })
  },

  onShareAppMessage: function() {
    var self = this;
    console.log('share');
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/tuan/isTuanZhang?id=" + app.globalData.openID, //给函数传递服务器地址参数
      data: {}, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function (res) {
        console.log('isTuanzhang', res);
        var shareid = res.data.data[0] ? app.globalData.openID : app.globalData.shareID;
        return {
          title: self.data.goodsDetail.summaryDescription,
          imageUrl: '',
          path: '/pages/details/commonDetails/commonDetails?id=' + self.data.goodsId + '&shareid=' + shareid // 路径，传递参数到指定页面。
        }

      },
    })
    
  },

  addToCart() {
    const self = this;

    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
      data: {
        "terminalUserId": app.globalData.openID,
        "buyType": "normal",
        "resId": self.data.goodsId,
        "shareTuanZhangId": app.globalData.shareID
      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('commonDetail-addToCar', res);
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      },
    })

  },

  buy() {
    let self = this;
    var goods = [{
      buyType: "normal",
      resId: this.data.goodsDetail.id,
      goodsId: this.data.goodsDetail.id,
      name: this.data.goodsDetail.name,
      price: this.data.goodsDetail.price,
      image: this.data.goodsDetail.mainImgData,
      shareId: app.globalData.shareID,
      num: 1,
    }];
    wx.setStorage({
      key: "selectGoods",
      data: goods,
      success(res) {
        wx.navigateTo({
          url: '/pages/orders/orders'
        })
      }
    });

  },

  toHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }


})