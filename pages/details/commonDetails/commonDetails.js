var app = getApp();
Page({
       data: {
              goodsDetail: {
              },
              hasCarts: false,
              goodsId: null,
              shareId: ''
       },
       onLoad(options) {
              var id = options.id;
              var shareid = options.shareid
              var self = this;
              self.setData({
                     shareId: shareid,
                     goodsId:id
              })
              //查询详情
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/goods/getbyid?id=" + id, //给函数传递服务器地址参数
                     data: {
                            
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "GET",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            //TO-DO 详细信息
                            console.log('commonDetail', res);
                            self.setData({
                                   goodsDetail: res.data.data[0]
                            })

                     },
              })

       },

       onShareAppMessage: function () {
              console.log('share');
              return {
                     title: this.data.goodsDetail.summaryDescription,
                     imageUrl: '',
                     path: '/pages/details/commonDetails?id=' + this.data.goodsId + '&shareid=' + app.globalData.openID// 路径，传递参数到指定页面。
              }
       },

       addToCart() {
              const self = this;

              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
                     data: {
                            "terminalUserId": app.globalData.openID,
                            "buyType": "normal",
                            "resId": self.data.goodsId,
                            "tuanZhangId":self.data.shareId
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('commonDetail-addToCar', res);

                     },
              })

       },

       buy() {
             let self = this;
              var goods = [{
                     buyType:"normal",
                     resId: this.data.goodsDetail.id,
                     goodsId: this.data.goodsDetail.id,
                     name: this.data.goodsDetail.name,
                     price: this.data.goodsDetail.price,
                     image: this.data.goodsDetail.mainImgData,
                     shareId: this.data.shareId,
                     num: 1,
              }];
              wx.setStorage({
                     key: "selectGoods",
                     data: goods,
                     success(res){
                            wx.navigateTo({
                                   url: '/pages/orders/orders'
                            })
                     }
              });
              
       },

      
})