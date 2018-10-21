var app = getApp();
Page({
       data: {
              titlePictures:[],
              pictures: [{
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
              fruits: [{
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
              quickSell:[],
              commonSell:[],
              indicatorDots: true,
              vertical: false,
              autoplay: true,
              circular: true,
              interval: 2000,
              duration: 500,
              previousMargin: 0,
              nextMargin: 0
       },
       onLoad: function() {
              var self = this;
              //首页滚动
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/homeimgs/getList", //给函数传递服务器地址参数
                     data: {
                            
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            console.log('title',res);
                            var pictures = [];
                            for (var index in res.data.data){
                                   pictures.push('data:image/png;base64,' + res.data.data[index].imgData);
                            }
                            self.setData({
                                   titlePictures: pictures,
                            })
                     },
              })
              //首页产品信息
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/goods/getList", //给函数传递服务器地址参数 
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
                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log(res); //打印出返回的数据
                            var quickSell = [];
                            var commonSell = [];
                            for (var index in res.data.data) {
                   
                                   if (res.data.data[index].hasSecKillPlan == 'Y'){
                                          quickSell.push({
                                                 id: res.data.data[index].id,
                                                 title: res.data.data[index].name,
                                                 price: res.data.data[index].price,
                                                 image: 'data:image/png;base64,' +res.data.data[index].mainImgData
                                          });
                                   }else{
                                          commonSell.push({
                                                 id: res.data.data[index].id,
                                                 title: res.data.data[index].name,
                                                 price: res.data.data[index].price,
                                                 image: 'data:image/png;base64,' +res.data.data[index].mainImgData
                                          });
                                   }
                                   
                            }
                            self.setData({
                                   quickSell: quickSell,
                                   commonSell: commonSell
                            })
                     },
              })
       },
       seckill: function(e) {
              wx.navigateTo({
                     url: '../details/seckillDetails/seckillDetails'
              })
       },
       commonBuy: function (e) {
           
              var id = e.currentTarget.dataset.productid;
              wx.navigateTo({
                     url: '../details/commonDetails/commonDetails?id='+id
              })
       },

})