// page/component/details/details.js
Page({
  data:{
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



  addToCart() {
    const self = this;

    self.setData({
      show: true
    })
    setTimeout( function() {
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