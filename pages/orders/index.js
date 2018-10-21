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
              if (this.data.currentTab == 0) {
                     this.setCurrentData()
              }
             
       },
       setCurrentData: function() {
              
              var self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/getList", //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            console.log('order', res);

                     },
              })
              // app.request.wxRequest({
              //   url:'orders-list',
              //   data:{sid:self.data.currentTab,page:self.data.page},
              //   success:function(res){
              //     if(!res){
              //       self.data.loading = false
              //       self.setData({
              //         loading:false
              //       })
              //       var ordersData = self.data.ordersData
              //     }else{
              //       var ordersData = self.data.ordersData = self.data.ordersData.concat(res)
              //     }
              //     if(res.length<4){
              //       self.setData({
              //         loading:false
              //       })
              //     }
              //     self.setData({
              //       ordersList:ordersData
              //     })
              //   }
              // })
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
       },
       scrolltolower: function() {
              ++this.data.page
              this.setCurrentData()
       }
})