var app = getApp();
Page({
       data: {
              carts: [], // 购物车列表
              hasList: false, // 列表是否有数据
              totalPrice: 0, // 总价，初始为0
              selectAllStatus: true, // 全选状态，默认全选
              obj: {
                     name: "hello"
              }
       },


       onShow() {
              var self = this;
              //查询购物车
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/getList", //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            //TO-DO 详细信息
                            console.log('cart', res);
                            var hasList = false;
                            if (res.data.data.length > 0) {
                                   hasList = true;
                            }
                            self.setData({
                                   carts: res.data.data,
                                   hasList: hasList
                            })

                     },
              })
       },
       /**
        * 当前商品选中事件
        */
       selectList(e) {
              const index = e.currentTarget.dataset.index;
              let carts = this.data.carts;
              const selected = carts[index].selected;
              if (selected) {
                     carts[index].selected = !selected;
              } else {
                     carts[index].selected = true;
              }
              this.setData({
                     carts: carts
              });
              this.getTotalPrice();
       },

       /**
        * 删除购物车当前商品
        */
       deleteList(e) {
              const index = e.currentTarget.dataset.index;
              const id = e.currentTarget.dataset.id;
              let carts = this.data.carts;
              carts.splice(index, 1);
              this.setData({
                     carts: carts
              });
              if (!carts.length) {
                     this.setData({
                            hasList: false
                     });
              } else {
                     this.getTotalPrice();
              }
              //从购物车删除
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/delete/"+id, //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "DELETE",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            //TO-DO 详细信息
                            console.log('cart', res);
                     },
              })
       },

       /**
        * 购物车全选事件
        */
       selectAll(e) {
              let selectAllStatus = this.data.selectAllStatus;
              selectAllStatus = !selectAllStatus;
              let carts = this.data.carts;

              for (let i = 0; i < carts.length; i++) {
                     carts[i].selected = selectAllStatus;
              }
              this.setData({
                     selectAllStatus: selectAllStatus,
                     carts: carts
              });
              this.getTotalPrice();
       },

       /**
        * 绑定加数量事件
        */
       addCount(e) {
              const index = e.currentTarget.dataset.index;
              let carts = this.data.carts;
              let num = carts[index].goodsNum;
              num = num + 1;
              carts[index].goodsNum = num;
              this.setData({
                     carts: carts
              });
              this.getTotalPrice();
       },

       /**
        * 绑定减数量事件
        */
       minusCount(e) {
              const index = e.currentTarget.dataset.index;
              const obj = e.currentTarget.dataset.obj;
              let carts = this.data.carts;
              let num = carts[index].goodsNum;
              if (num <= 1) {
                     return false;
              }
              num = num - 1;
              carts[index].goodsNum = num;
              this.setData({
                     carts: carts
              });
              this.getTotalPrice();
       },

       /**
        * 计算总价
        */
       getTotalPrice() {
              let carts = this.data.carts; // 获取购物车列表
              let total = 0;
              for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
                     if (carts[i].selected) { // 判断选中才会计算价格
                            total += carts[i].goodsNum * carts[i].goodsPrice; // 所有价格加起来
                     }
              }
              this.setData({ // 最后赋值到data中渲染到页面
                     carts: carts,
                     totalPrice: total.toFixed(2)
              });
       },

       pay() {
              let selectGoods = [];
              let carts = this.data.carts; 
              for (let i = 0; i < carts.length; i++) { 
                     if (carts[i].selected) { 
                            selectGoods.push({
                                   id: carts[i].id,
                                   name: carts[i].goodsName,
                                   price: carts[i].goodsPrice,
                                   image: carts[i].goodsMainImgData,
                                   num: carts[i].goodsNum,
                            }); 
                     }
              }
              wx.setStorage({
                     key:"selectGoods",
                     data: selectGoods,
                     success(res) {
                            wx.navigateTo({
                                   url: '/pages/orders/orders'
                            })

                     }
              });
           
       }

})