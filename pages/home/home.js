Page({
  data: {
    pictures: [
      {
        mode: 'scaleToFill',
        src: '../../images/1.jpg'
        },
      {
        mode: 'scaleToFill',
        src: '../../images/2.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/3.jpg'
      }
    ],
    fruits: [
      {
        mode: 'scaleToFill',
        src: '../../images/3.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/4.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/5.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/6.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/1.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/2.jpg'
      },
      {
        mode: 'scaleToFill',
        src: '../../images/3.jpg'
      }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  seckill:function (e) {
    wx.navigateTo({
      url: '../details/seckillDetails/seckillDetails'
    })
  }
  
})
