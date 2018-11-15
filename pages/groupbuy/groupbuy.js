var app = getApp();
Page({
       data: {
              goodsList: [],
              indicatorDots: true,
              vertical: false,
              autoplay: true,
              circular: true,
              interval: 2000,
              duration: 500,
              previousMargin: 0,
              nextMargin: 0
       },
       onLoad: function() {
              var self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/groupbuyplan/getList", //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('groupBuy', res);
                            var goods = [];
                            for (var index in res.data.data) {
                                   goods.push({
                                          name: res.data.data[index].goodsName,
                                          price: res.data.data[index].price,
                                          image: res.data.data[index].goodsMainImgData
                                   });
                            }
                            self.setData({
                                   goodsList: goods,
                            })
                     },
              })
       },
       durationChange: function(e) {
              this.setData({
                     duration: e.detail.value
              })
       },

       showGroupDetail() {
              wx.navigateTo({
                     url: '../details/groupDetails/groupDetails'
              })
       }

})