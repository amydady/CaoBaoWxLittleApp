var app = getApp();
Page({
  data: {
    goodsDetail: {},
    hasCarts: false,
    curIndex: 0,
    goodsId: '',
    canBuy: true
  },

  onLoad(options) {
    var self = this;
    var id = options.id;
    app.globalData.shareID = options.shareid
    self.setData({
      goodsId: id
    })

    //查询详情
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/seckillplan/getbyid?id=" + id, //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        //TO-DO 详细信息
        console.log('seckillDetail', res);
        self.setData({
          goodsDetail: res.data.data[0]
        })

      },
    })

    this.processSecKillTimeInfo()
  },

  // 处理秒杀时间相关信息
  processSecKillTimeInfo() {
    var that = this;
    setInterval(function() {
      var remaindTimeDisplay = "";
      var now = Date.parse(new Date()) / 1000;
      var startTime = Date.parse(that.data.goodsDetail.startTime.replace(/\-/g, "/")) / 1000;
      var endTime = Date.parse(that.data.goodsDetail.endTime.replace(/\-/g, "/")) / 1000;

      // console.log("now:", now)
      // console.log("startTime:", startTime)
      // console.log("endTime:", endTime)
      if (now < startTime) { //即将开始
        let remaindTime = startTime - now;
        remaindTimeDisplay = "即将开始：" + remaindTime;
        that.data.canBuy=false;

      } else if (now > endTime) { //刚刚结束
        remaindTimeDisplay = "已经结束";
        that.data.canBuy = false;
      } else { //进行中
        let remaindTime = endTime - now;
        that.data.canBuy = true;
        remaindTimeDisplay = "距离结束：";

        if (Math.floor(remaindTime / (3600 * 24)) > 0) {
          remaindTimeDisplay += Math.floor(remaindTime / (3600 * 24)) + " 天";
        } else if (Math.floor(remaindTime / (3600)) > 0) {
          remaindTimeDisplay += Math.floor(remaindTime / (3600)) + " 小时";
        } else if (Math.floor(remaindTime / 60) > 0) {
          remaindTimeDisplay += Math.floor(remaindTime / 60) + " 分钟";
        } else if (remaindTime > 0) {
          remaindTimeDisplay += remaindTime + " 秒";
        } else {
          remaindTimeDisplay = "已经结束";
          that.data.canBuy = false;
        }
      }


      that.data.goodsDetail.remaindTimeDisplay = remaindTimeDisplay;

      that.setData({
        goodsDetail: that.data.goodsDetail,
        canBuy: that.data.canBuy
      });


    }, 1000);
  },

  onShareAppMessage: function() {
    console.log('share');
    return {
      title: this.data.goodsDetail.goodsSummaryDescription,
      imageUrl: '',
      path: '/pages/details/seckillDetails/seckillDetails?id=' + this.data.goodsId + '&shareid=' + app.globalData.openID // 路径，传递参数到指定页面。
    }
  },

  addToCart() {
    const self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
      data: {
        "terminalUserId": app.globalData.openID,
        "buyType": "seckill",
        "resId": self.data.goodsDetail.id,
        "shareTuanZhangId": app.globalData.shareID
      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('secDetail-addToCar', res);
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
      buyType: "seckill",
      resId: this.data.goodsDetail.id,
      goodsId: this.data.goodsDetail.goodsId,
      name: this.data.goodsDetail.goodsName,
      price: this.data.goodsDetail.goodsPrice,
      image: this.data.goodsDetail.goodsMainImgData,
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

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }

})