var app = getApp();
Page({
       data: {
              addressInfo: {},
              hasAddress: false,
              total: 0,
              orders: []
       },

       onReady() {
              this.getTotalPrice();
       },

       onShow: function() {
              // const self = this;
              // wx.getStorage({
              //        key: 'address',
              //        success(res) {
              //               self.setData({
              //                      address: res.data,
              //                      hasAddress: true
              //               })
              //        }
              // })
       },
       onLoad(options) {
              let self = this;
              wx.getStorage({
                     key: 'selectGoods',
                     success(res) {
                            self.setData({
                                   orders: res.data,
                            })
                     }
              })


       },

       /**
        * 计算总价
        */
       getTotalPrice() {
              let orders = this.data.orders;
              let total = 0;
              for (let i = 0; i < orders.length; i++) {
                     total += orders[i].num * orders[i].price;
              }
              this.setData({
                     total: total
              })
       },

       toPay() {
              let self = this;
              let orders = this.data.orders;
              let payOders = [];
              for (let i = 0; i < orders.length; i++) {
                     payOders.push({
                            buyType: orders[i].buyType,
                            resId: orders[i].resId,
                            goodsId: orders[i].goodsId,
                            price: orders[i].price,
                            goodsNum: orders[i].num,
                     });
              }
              if (this.check()) {
                     wx.request({
                            url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/create", //给函数传递服务器地址参数
                            data: {
                                   "orderMO": {
                                          "terminalUserId": app.globalData.openID,
                                          "fee": self.data.total,
                                          "state": "daifukuan",
                                          "deliveryAddress": {
                                                 "province": self.data.addressInfo.provinceName,
                                                 "city": self.data.addressInfo.cityName,
                                                 "area": self.data.addressInfo.countyName,
                                                 "detailInfo": self.data.addressInfo.detailInfo,
                                          },
                                          "contactName": self.data.addressInfo.userName,
                                          "contactMobile": self.data.addressInfo.telNumber
                                   },
                                   "orderDetailMOs": payOders
                            }, //给服务器传递数据，本次请求不需要数据，可以不填
                            method: "POST",
                            header: {
                                   'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                            },
                            success: function(res) {
                                   console.log('orders', res);
                                   //pay weixin
                            },
                     })
              }
       },

       chooseAddress() {
              wx.chooseAddress({
                     success: (res) => {
                            this.setData({
                                   addressInfo: res,
                                   hasAddress: true
                            })
                     },
                     fail: function(err) {
                            console.log(err)
                     }
              })
       },
       check() {
              if (this.data.hasAddress) {
                     return true;
              }
              wx.showModal({
                     title: '提示',
                     content: '未添加收货地址',
                     text: 'center',
                     complete() {
                            return false;
                     }
              })
       }
})