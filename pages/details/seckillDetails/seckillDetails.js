var app = getApp();
Page({
       data: {
              goods: {
                     id: 1,
                     image: '/images/1.jpg',
                     title: '橘子',
                     price: 0.01,
                     stock: '有货',
                     detail: '这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。',
                     parameter: '125g/个',
                     service: '不支持退货'
              },
              goodsDetail:{},
              hasCarts: false,
              curIndex: 0,
       },

       onLoad(options) {
              var id = options.id;
              var self = this;
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
                     title: '弹出分享时显示的分享标题',
                     imageUrl: '',
                     path: '/user/user?id=123' // 路径，传递参数到指定页面。
              }
       },

       addToCart() {
              const self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
                     data: {
                            "terminalUserId": app.globalData.openID,
                            "buyType": "seckill",
                            "resId": self.data.goodsId
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('secDetail-addToCar', res);

                     },
              })

       },

       buy() {
              let self = this;
              var goods = [{
                     redId: this.data.goodsDetail.id,
                     goodsId: this.data.goodsDetail.goodsId,
                     name: this.data.goodsDetail.goodsName,
                     price: this.data.goodsDetail.goodsPrice,
                     image: this.data.goodsDetail.goodsMainImgData,
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