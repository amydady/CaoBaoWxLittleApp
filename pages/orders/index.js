// pages/order/index.js
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
       onShow: function(options) {
              
              this.setCurrentData();
       },
       setCurrentData: function() {
              var state = {};
              if (this.data.currentTab == 0) {
                     state = {};
              } else if (this.data.currentTab == 1) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "daifukuan"
                                   }]
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
                                   }]
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
                                   }]
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
                                   }]
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
                                   }]
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
                                   }]
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
              var self = this
              var id = e.currentTarget.dataset.id
              app.request.wxRequest({
                     url: 'wx-pay',
                     data: {
                            oid: id
                     },
                     success: function(res) {
                            wx.requestPayment({
                                   'timeStamp': res.timeStamp,
                                   'nonceStr': res.nonceStr,
                                   'package': res.package,
                                   'signType': 'MD5',
                                   'paySign': res.paySign,
                                   'success': function(res) {
                                          self.data.ordersData = []
                                          self.data.page = 0
                                          self.setCurrentData()
                                   },
                                   'fail': function(res) {
                                          console.log(res)
                                   }
                            })
                     }
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