var app = getApp();
Page({
  data:{
     currentTab: 0,
     funs:null
  },
  onLoad(){
    var self = this;
         wx.request({
                url: app.globalData.serverUrl + "/rest/littlecat/caobao/quanzi/tuanmember/getlist", //给函数传递服务器地址参数
                data: {
                        condition: {
                              "logicType": "and",
                              "condItems": [
                                     {
                                            "fieldName": "enable",
                                            "opType": "equal",
                                            "value": "Y"
                                     },
                                     {
                                            "fieldName": "tuanId",
                                            "opType": "equal",
                                            "value": app.globalData.openID
                                     }
                              ]
                       },
                }, 
               
                method: "POST",
                header: {
                       'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                },
                success: function (res) {
                       //TO-DO 详细信息
                       console.log('funs', res);
                       self.setData({
                              funs: res.data.data
                       })
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