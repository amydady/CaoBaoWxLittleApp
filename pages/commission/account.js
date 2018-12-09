var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryAccount();
  },

  //查询上次的账户信息
  queryAccount() {
    var self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/commission/calc/getLatestApplyInfo?tuanZhangId=" + app.globalData.openID,
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('last-account', res);
        if (res.data.data.length > 0) {
          self.data.accountInfo = res.data.data[0]
        }
      },

    })
  },

  check(value) {
    if ((value.bankHolderName && value.bankName && value.bankAccount )|| (value.zfbName && value.zfbAccount)) {
      return false;
    
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请填写完整账户信息',
        showCancel:false,
        text: 'center',
        complete() {

        }
      })
      return true;
    }
  },

  //提交申请
  formSubmit(e) {
    var self = this;
    const value = e.detail.value;
    if (this.check(value)) {
      return;
    }
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/commission/calc/apply",
      data: {
        'tuanZhangId': app.globalData.openID,
        'bankHolderName': value.bankHolderName,
        'bankName': value.bankName,
        'bankAccount': value.bankAccount,
        'zfbName': value.zfbName,
        'zfbAccount': value.zfbAccount
      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('apply-success', res);
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          duration: 2000
        })
        self.onShow();
      },
      fail: function() {
        console.log('apply-fail');
        wx.showToast({
          title: '申请失败，请稍后再试',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})