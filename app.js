//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
            var code = res.code;
       //  发送 res.code 到后台换取 openId, sessionKey, unionId
             wx.request({
                    url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx59e6873e9161c795&secret=4dc7b0ee2cb613eeb79faa811b998d25&js_code=" + code+"&grant_type=authorization_code",
                    data: {

                    }, //给服务器传递数据，本次请求不需要数据，可以不填
                    method: "POST",
                    header: {
                           'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                    },
                    success: function (res) {
                         console.log("openID",res);
                    },
             })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  redirect: function (url, param) {
    wx.navigateTo({
      url: '/pages/' + url + '?' + param
    })
  },
})