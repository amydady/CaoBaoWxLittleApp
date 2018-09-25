// page/component/orders/orders.js
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders:[
        {id:1,title:'新鲜芹菜 半斤',image:'/images/5.jpg',num:4,price:0.01},
        {id:2,title:'素米 500g',image:'/images/6.jpg',num:1,price:0.03}
      ]
  },

  onReady() {
    this.getTotalPrice();
  },
  
  onShow:function(){
    const self = this;
    wx.getStorage({
      key:'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    if(this.check()){
      wx.showModal({
        title: '提示',
        content: '本系统只做演示，支付系统已屏蔽',
        text: 'center',
        complete() {
          wx.switchTab({
            url: '/pages/user/user'
          })
        }
      })
    }
  },

  check(){
    wx.showModal({
      title: '提示',
      content: '未添加收货地址',
      text: 'center',
      complete() {
        return false;
      }
    })
  }
})