//app.js
App({
       onLaunch: function() {
              // 展示本地存储能力
              var logs = wx.getStorageSync('logs') || []
              logs.unshift(Date.now())
              wx.setStorageSync('logs', logs)
              var self = this;
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
                                   success: function(res) {
                                          console.log("openID", res);
                                          self.globalData.openID = JSON.parse(res.data.data[0]).openid;
                                          self.getUserInfo();
                                   },
                            })

                     }
              })

       },

       getUserInfo() {
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
                                          
                                   },
                            })
                     }
              })
       },

       globalData: {
              userInfo: null,
              serverUrl: "https://s.yimiwei.cn:8006",
              // serverUrl: "http://192.168.0.102:8116",
              // serverUrl: "http://localhost:8116",
              openID: null,
              shareID: null
       },
       redirect: function(url, param) {
              wx.navigateTo({
                     url: '/pages/' + url + '?' + param
              })
       },
})