Page({
  data: {
    productInfoList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  onLoad: function () {
    //获取拼团信息
    this.setData({
      productInfoList: [{
        name:'荔枝',
        src:'../../images/5.jpg',
        price:'5'
      },{
          name: '苹果',
          src: '../../images/6.jpg',
          price: '7'
        }, {
          name: '草莓',
          src: '../../images/7.jpg',
          price: '9.9'
        }, {
          name: '荔枝',
          src: '../../images/5.jpg',
          price: '5'
        }, {
          name: '苹果',
          src: '../../images/6.jpg',
          price: '7'
        }, {
          name: '草莓',
          src: '../../images/7.jpg',
          price: '9.9'
        }]
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  }
})
