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
              for (let i = 0; i < orders.length; i++){
                     payOders.push({
                            buyType:111,
                            resId: orders[i].resId,
                            goodsId: orders[i].goodsId,
                            price: orders[i].price,
                            goodsNum: orders[i].num,
                     });
              }
              if (this.check()) {
                     wx.request({
                            url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
                            data: {
                                   "orderMO": {
                                          "terminalUserId": app.globalData.openID,
                                          "fee": self.data.total,
                                          "state": "daifukuan",
                                          "deliveryAddress": {
                                                 "provinceId": self.data.addressInfo.provinceName,
                                                 "cityId": self.data.addressInfo.cityName,
                                                 "areaId": self.data.addressInfo.countyName,
                                                 "detailInfo": self.data.addressInfo.detailInfo,

                                          }
                                   },
                                   "orderDetailMOs":
                                          [{
                                                 "buyType": "normal",
                                                 "resId": "590452ef-94b3-4167-9fc5-d52b809cd257",
                                                 "goodsId": "590452ef-94b3-4167-9fc5-d52b809cd257",
                                                 "price": 100,
                                                 "goodsNum": 10
                                          }
                                          ]
                            }, //给服务器传递数据，本次请求不需要数据，可以不填
                            method: "POST",
                            header: {
                                   'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                            },
                            success: function (res) {
                                   console.log('commonDetail-addToCar', res);

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