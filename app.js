//app.js
App({
       onLaunch: function() {
              
       },

       getToken(){
         var self = this;
         return new Promise((resolve, reject) => {
           // 登录
           wx.login({
             success: res => {
               console.log("login", res);
               var code = res.code;
               //  发送 res.code 到后台换取 openId, sessionKey, unionId
               wx.request({
                 url: this.globalData.serverUrl + "/rest/littlecat/caobao/wxuserinfo/login?code=" + code,
                 data: {

                 }, //给服务器传递数据，本次请求不需要数据，可以不填
                 method: "GET",
                 header: {
                   'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                 },
                 success: function (res) {
                   console.log("openID", res);
                   self.globalData.openID = JSON.parse(res.data.data[0]).openid;
                   self.getUserInfo(resolve);
                 
                 },
               })

             }
           })
         })
       },

  getUserInfo(resolve) {
              let self = this;
              wx.getUserInfo({
                     success: function(res) {
                            console.log("userInfo", res.userInfo);
                            self.globalData.userInfo = res.userInfo;
                            wx.request({
                                   url: self.globalData.serverUrl + "/rest/littlecat/caobao/terminaluser/add",
                                   data: {
                                          id: self.globalData.openID,
                                          name: res.userInfo.nickName,
                                          image: res.userInfo.avatarUrl
                                   }, //给服务器传递数据，本次请求不需要数据，可以不填
                                   method: "POST",
                                   header: {
                                          'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                                   },
                                   success: function(res) {
                                          console.log('userInfo-success', res);
                                     resolve();
                                   },
                            })
                     }
              })
       },

       globalData: {
              userInfo: null,
              serverUrl: "https://s.yimiwei.cn:8006",
              // serverUrl: "http://192.168.0.108:8116",
              // serverUrl: "http://localhost:8116",
         openID: 'o9pFJ5EvqFvInxRIpBw0CY25LNAAl',
              shareID: null
       },
       redirect: function(url, param) {
              wx.navigateTo({
                     url: '/pages/' + url + '?' + param
              })
       },
})