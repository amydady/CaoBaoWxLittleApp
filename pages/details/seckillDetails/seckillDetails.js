var app = getApp();
Page({
       data: {
              goodsDetail:{},
              hasCarts: false,
              curIndex: 0,
              goodsId:''
       },

       onLoad(options) {
              var self = this;
              var id = options.id;
              app.globalData.shareID = options.shareid
              self.setData({
                     goodsId:id
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
                     success: function (res) {
                            //TO-DO 详细信息
                            console.log('seckillDetail', res);
                            self.setData({
                                   goodsDetail: res.data.data[0]
                            })

                     },
              })

       },



       onShareAppMessage: function() {
              console.log('share');
              return {
                     title: this.data.goodsDetail.goodsSummaryDescription,
                     imageUrl: '',
                path: '/pages/details/seckillDetails/seckillDetails?id=' + this.data.goodsId+'&shareid=' + app.globalData.openID// 路径，传递参数到指定页面。
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