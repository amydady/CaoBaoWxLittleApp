var app = getApp()
Page({
       data: {
              currentTab: 0,
              page: 0,
              ordersData: [],
       },
       onLoad: function(options) {
             
       },
       onShow: function(options) {
              this.setCurrentData(this.data.currentTab)
       },
       setCurrentData: function(index) {
              var self = this;
              let state;
              if (index == 0){
                     state = 'calced'
              } else if (index == 1){
                     state = 'canapply'
              } else if (index == 2) {
                     state = 'applyed'
              } else if (index == 3) {
                     state = 'payed'
              } else if (index == 4) {
                     state = 'disabled'
              }
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/commission/calc/getList", //给函数传递服务器地址参数
                     data: {
                            tuanZhangId: app.globalData.openID,
                            state: state,
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "GET",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            console.log('shop-order', res);
                            self.setData({
                                   ordersData: res.data.data
                            })
                     },
              })
       },

      
       // 点击tab切换 
       swichNav: function(e) {
              if (this.data.currentTab == e.currentTarget.dataset.current) return;

              this.data.currentTab = e.currentTarget.dataset.current
              this.setData({
                     currentTab: this.data.currentTab
              })
              this.setCurrentData(this.data.currentTab)
       }
})