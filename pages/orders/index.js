import md5 from '../../utils/md5.js';
var app = getApp()
Page({
  data: {
    currentTab: 0,
    scrollTop: 0,
    page: 0,
    ordersData: [],
  },
  onLoad: function(options) {
    var current = options.id;
    this.data.currentTab = current ? current : 0
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      currentTab: this.data.currentTab,
      windowHeight: systemInfo.windowHeight
    })
  },
  onShow: function() {

    this.setCurrentData();
  },
  setCurrentData: function() {
    var state = {};
    if (this.data.currentTab == 0) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
            "fieldName": "terminalUserId",
            "opType": "equal",
            "value": app.globalData.openID
          }]
        }
      };
    } else if (this.data.currentTab == 1) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "equal",
              "value": "daifukuan"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    } else if (this.data.currentTab == 2) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "equal",
              "value": "daichengtuan"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    } else if (this.data.currentTab == 3) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "equal",
              "value": "daifahuo"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    } else if (this.data.currentTab == 4) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "equal",
              "value": "daiqianshou"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    } else if (this.data.currentTab == 5) {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "equal",
              "value": "yishouhuo"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    } else {
      state = {
        "condition": {
          "logicType": "and",
          "condItems": [{
              "fieldName": "state",
              "opType": "in",
                 "value": "'tuikuanzhong','yituikuan','tuangoujiesantuikuan'"
            },
            {
              "fieldName": "terminalUserId",
              "opType": "equal",
              "value": app.globalData.openID
            }
          ]
        }
      }
    }
    var self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/getList", //给函数传递服务器地址参数
      data: state, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('order', res);
        self.setData({
          ordersData: res.data.data
        })
      },
    })

  },
  toGroupDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    app.redirect('group/detail', 'id=' + id)
  },

  toPay: function(e) {
    let self = this;
    let orderId = e.currentTarget.dataset.id;
    wx.showLoading({

    })
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/unifiedOrder?id=" + orderId, //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('topay', res);

        self.pay(res.data.data[0]);

      },
    })

  },

       toCancel: function (e) {
              let self = this;
              let orderId = e.currentTarget.dataset.id;
           
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/cancel/" + orderId, //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "PUT",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            console.log('toCancel', res);
                            self.setCurrentData();
                     },
              })

       },

  /* 随机数 */
  randomString: function() {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 获取prepay_id */
  getXMLNodeValue: function(node_name, xml) {
    return xml.split("<" + node_name + ">")[1].split("</" + node_name + ">")[0];
  },

  /* 时间戳产生函数   */
  createTimeStamp: function() {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  /* 支付   */
  pay: function(prepay_id) {
    let self = this;
    //签名  
    var key = 'q9qShwkPzNTKlU5vJTvMb3DA6OYcZzD5';
    var appId = 'wx59e6873e9161c795';
    var timeStamp = self.createTimeStamp();
    var nonceStr = self.randomString();
    var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key
    var sign = md5(stringSignTemp).toUpperCase()

    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: 'prepay_id=' + prepay_id,
      signType: "MD5",
      paySign: sign,
      success: function(res) {
        // success
        console.log('支付成功', res)
        self.paySuccess();
        wx.hideLoading()
        this.setData({
          disabled: true
        })
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail: function() {
        // fail
        console.log("支付失败")
        wx.hideLoading()
      },
      complete: function() {
        // complete
        console.log("pay complete")
      }
    })
  },
  paySuccess(orderId) {
    let self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/payOrder/" + orderId, //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('pay-success', res);
        self.onShow();
      },
    })
  },
  confirmReceipt: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '是否确认收货？',
      success: function(res) {
        if (res.confirm) {
          app.request.wxRequest({
            url: 'confirm-receipt',
            data: {
              oid: id
            },
            success: function(res) {
              self.data.ordersData = []
              self.data.page = 0
              self.setCurrentData()
            }
          })
        }
      }
    })
  },
  showOrderDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    app.redirect('orders/detail', 'oid=' + id)
  },
  showGoodsDetial: function(e) {
    var id = e.currentTarget.dataset.id;
    app.redirect('goods/detail', 'gid=' + id);
  },
  // 滑动切换tab 
  bindChange: function(e) {
    this.data.page = 0
    this.data.ordersData = []
    this.data.currentTab = e.detail.current
    this.setCurrentData()
    this.setData({
      ordersList: [],
      currentTab: this.data.currentTab
    })
  },
  // 点击tab切换 
  swichNav: function(e) {
    if (this.data.currentTab == e.currentTarget.dataset.current) return;

    this.data.currentTab = e.currentTarget.dataset.current
    this.setData({
      currentTab: this.data.currentTab
    })
    this.setCurrentData();
  },
  scrolltolower: function() {
    ++this.data.page
    this.setCurrentData()
  }
})