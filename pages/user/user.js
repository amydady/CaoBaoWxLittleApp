var app = getApp();
Page({
       data: {
              thumb: '',
              nickname: '',
              orders: [],
              hasAddress: false,
              address: {},
              funsCount: 20
       },
       onLoad() {
              var self = this;
         
       },
       onShow() {
              var self = this;
              /**
               * 获取本地缓存 地址信息
               */
              wx.getStorage({
                     key: 'address',
                     success: function(res) {
                            self.setData({
                                   hasAddress: true,
                                   address: res.data
                            })
                     }
              })
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
})