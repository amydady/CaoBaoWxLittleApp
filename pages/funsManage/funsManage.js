var app = getApp();
Page({
  data:{
     currentTab: 0,
  },
  onLoad(){
    var self = this;
         wx.request({
                url: app.globalData.serverUrl + "/rest/littlecat/caobao/quanzi/tuanmember/getlist", //给函数传递服务器地址参数
                data: {
                     //   tuanId: app.globalData.openID
                       tuanId: 1
                }, //给服务器传递数据，本次请求不需要数据，可以不填
                method: "POST",
                header: {
                       'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                },
                success: function (res) {
                       //TO-DO 详细信息
                       console.log('funs', res);
                },
         })
    
  },
  showProduct: function (e){
       if (this.data.currentTab == e.currentTarget.dataset.current) return;

       this.data.currentTab = e.currentTarget.dataset.current
       this.setData({
            currentTab: this.data.currentTab
       })
  }
})