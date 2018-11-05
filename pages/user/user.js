var app = getApp();
Page({
       data: {
              thumb: '',
              nickname: '',
              orders: [],
              hasAddress: false,
              address: {},
              funsCount: 20,
              isLogin: false
       },
       onLoad() {

              if (app.globalData.userInfo) {
                     this.data.isLogin = true;
              }
              this.setData({
                     isLogin: true,
              })
       },
       onShow() {
              var self = this;

       },
       /**
        * 发起支付请求
        */
       payOrders() {
              wx.requestPayment({
                     timeStamp: 'String1',
                     nonceStr: 'String2',
                     package: 'String3',
                     signType: 'MD5',
                     paySign: 'String4',
                     success: function(res) {
                            console.log(res)
                     },
                     fail: function(res) {
                            wx.showModal({
                                   title: '支付提示',
                                   content: '<text>',
                                   showCancel: false
                            })
                     }
              })
       },

       showOrder: function(e) {
              var type = e.currentTarget.dataset.type
              app.redirect('orders/index', 'id=' + type)
       },

       //商铺管理
       shopManage() {
              app.redirect('shopManage/shopManage')
       },
       //我的粉丝
       showFuns() {
              app.redirect('funsManage/funsManage')
       },
       //商铺订单详情
       showShopOrder() {
              app.redirect('shopOrder/shopOrder')
       },
       //兑换福利
       welfare() {
              app.redirect('welfare/welfare')
       },
       //我的佣金
       showCommission() {
              app.redirect('commission/commission')
       },
       //关于我们
       aboutUS() {
              app.redirect('aboutUs/aboutUs')
       },
       groupOwner() {
              app.redirect('groupOwner/groupOwner')
       },
       bindGetUserInfo: function(e) {
              app.globalData.userInfo = e.detail.userInfo;
              this.setData({
                     isLogin: true,
              })
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/terminaluser/add ", //给函数传递服务器地址参数
                     data: {
                            id: app.globalData.openID,
                            name: e.detail.userInfo.nickName,
                            image: e.detail.userInfo.avatarUrl
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('userInfo-success', res);
                     },
              })
       }
})