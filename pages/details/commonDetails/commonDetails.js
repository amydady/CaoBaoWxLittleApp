// page/component/details/details.js
Page({
       data: {
              goods: {
                     id: 1,
                     image: '/images/1.jpg',
                     title: '橘子',
                     price: 0.01,
                     stock: '有货',
                     detail: '这是一个橘子。',
                     parameter: '125g/个',
                     service: '不支持退货'
              },
              hasCarts: false,
              curIndex: 0,
       },
       onLoad(options) {
              var id = options.id;
              //查询详情
              wx.request({
                     url: "http://192.168.0.110:8006/rest/littlecat/caobao/goods/getbyid?id=" + id, //给函数传递服务器地址参数
                     data: {
                            
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "GET",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            debugger;
                            console.log('commonDetail', res);

                     },
              })
       },


       addToCart() {
              const self = this;

              wx.request({
                     url: "http://192.168.0.110:8006/rest/littlecat/caobao/shoppingcart/add", //给函数传递服务器地址参数
                     data: {
                            "terminalUserId": "terminalUserId1",
                            "buyType": "normal",
                            "resId": "resId001"
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            debugger;
                            console.log('commonDetail-addToCar', res);

                     },
              })

              self.setData({
                     show: true
              })
              setTimeout(function() {
                     self.setData({

                     })

              }, 300)

       },

       buy() {
              wx.navigateTo({
                     url: '../orders/orders'
              })

       },

       bindTap(e) {
              const index = parseInt(e.currentTarget.dataset.index);
              this.setData({
                     curIndex: index
              })
       }

})