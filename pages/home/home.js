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
  onLoad : function(){
    wx.request({
      url: "http://192.168.0.104:8006/rest/littlecat/caobao/goods/getList",//给函数传递服务器地址参数 
      data: {
        "condition": {
          "logicType": "and",
          "condItems": [
            // {
            //   "fieldName": "id",
            //   "opType": "equal",
            //   "value": "b4e72e08-3d68-4f69-96fc-ab21d1d3a6f5"
            // }
          ]
        },
        "pageParam": {
          "pageSize": 4,
          "pageIndex": 1
        },
        "sortFields": "name",
        "sortType": "desc"
      },//给服务器传递数据，本次请求不需要数据，可以不填
      method:"POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function (res) {
        console.log(res);//打印出返回的数据
        var data = res.data;
       // this.setData({
          // list: data
       // })//通过setData方法把返回的数据复制给本页面定义的list数组
      },
    })
  },
  seckill:function (e) {
    wx.navigateTo({
      url: '../details/seckillDetails/seckillDetails'
    })
  }
  
})
