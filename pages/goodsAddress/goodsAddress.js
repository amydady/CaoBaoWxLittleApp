var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsAddress: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/tuan/getDeliverySiteList?province=" + options.province + '&city=' + options.city + '&area=' + options.area, //给函数传递服务器地址参数
      data: {}, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('goodsAddress', res);
        self.setData({
          goodsAddress: res.data.data
        })
      },
    })
  },

  chooseAddress(e) {
    let self = this;
    const index = e.currentTarget.dataset.index;
    wx.setStorage({
      key: "selectAddress",
      data: self.data.goodsAddress[index],
      success(res) {
        wx.navigateBack({
          
        })
      }
    });
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