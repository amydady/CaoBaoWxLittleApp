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
                              applyHistory.push(commision.applyHistory[i].split(",")[1]);
                       }
                       let totalPayedFee = 0;
                       let totalCanApplyFee = 0;
                       if (commision.totalCanApplyFee != null && commision.totalCanApplyFee!= undefined){
                              totalCanApplyFee = commision.totalCanApplyFee;
                       }
                       if (commision.totalPayedFee != null && commision.totalPayedFee != undefined) {
                              totalPayedFee = commision.totalPayedFee;
                       }
                       self.setData({
                              totalCanApplyFee: totalCanApplyFee,
                              totalPayedFee: totalPayedFee ,
                              applyHistory: applyHistory
                       })
                },
         })
  },

       apply(){
              var self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/commission/calc/apply/" + app.globalData.openID,
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "GET",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function (res) {
                            console.log('apply-success', res);
                            wx.showToast({
                                   title: '申请成功',
                                   icon: 'success',
                                   duration: 2000
                            })
                            self.onShow();
                     },
                     fail:function(){
                            console.log('apply-fail');
                            wx.showToast({
                                   title: '申请失败，请稍后再试',
                                   icon: 'success',
                                   duration: 2000
                            })
                     }
              })
       }
 
})