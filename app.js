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
                            var code = res.code;
                            //  发送 res.code 到后台换取 openId, sessionKey, unionId
                            wx.request({
                                   url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx59e6873e9161c795&secret=4dc7b0ee2cb613eeb79faa811b998d25&js_code=" + code + "&grant_type=authorization_code",
                                   data: {

                                   }, //给服务器传递数据，本次请求不需要数据，可以不填
                                   method: "POST",
                                   header: {
                                          'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                                   },
                                   success: function(res) {
                                          console.log("openID", res);
                                          self.globalData.openID = res.data.openid;
                                   },
                            })
                     }
              })
             
       },
       globalData: {
              userInfo: null,
              serverUrl: "http://192.168.0.107:8006",
              openID:null
       },
       redirect: function(url, param) {
              wx.navigateTo({
                     url: '/pages/' + url + '?' + param
              })
       },
})