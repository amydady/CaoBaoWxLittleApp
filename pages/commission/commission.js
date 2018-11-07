var app = getApp();
Page({
  data:{
         totalCanApplyFee:0,
         totalPayedFee:0,
         applyHistory:[]
  },
  onLoad(){
       
    
  },
  onShow(){
         var self = this;
         wx.request({
                url: app.globalData.serverUrl + "/rest/littlecat/caobao/commission/calc/getCommissionReport", 
                data: {
                       tuanZhangId: app.globalData.openID,
                }, //给服务器传递数据，本次请求不需要数据，可以不填
                method: "GET",
                header: {
                       'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                },
                success: function (res) {
                       console.log('commission', res);
                       let commision = res.data.data[0];
                       let applyHistory = [];
                       for (let i = 0; i < commision.applyHistory.length; i++){
                              applyHistory.push(commision.applyHistory[i].split(",")[0]);
                              applyHistory.push((commision.applyHistory[i].split(",")[1]/1000).toFixed(2));
                       }
                       self.setData({
                              totalCanApplyFee: (commision.totalCanApplyFee / 1000).toFixed(2),
                              totalPayedFee: (commision.totalPayedFee / 1000).toFixed(2),
                              applyHistory: applyHistory
                       })
                },
         })
  },
 
})