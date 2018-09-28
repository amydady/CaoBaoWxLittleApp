// page/component/details/details.js
Page({
  data:{
    goods: {
      id: 1,
      image: '/images/1.jpg',
      title: '橘子',
      price: 0.01,
      detail: '这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。这是一个橘子。',
      parameter: '125g/个',
      service: '不支持退货'
    },
    hasCarts: false,
    curIndex: 0,
  },

  onLoad() {
    console.log("refresh");
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
      url: '/pages/orders/orders'
    })

  },

  joinGroup(){
    //加入团购
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },

  createGroup(){
    //开团
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})