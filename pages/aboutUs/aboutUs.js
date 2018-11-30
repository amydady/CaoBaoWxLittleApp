var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryList();
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

  },
  queryList() {
    var self = this;
    
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/basicinfo/getAboutUsImgsList", //给函数传递服务器地址参数
      data: {
        "sortFields": "sortNum",
        "sortType": "asc"
      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function (res) {
        self.setData({
          imgs: res.data.data,
        })
      },
    })
  }


})