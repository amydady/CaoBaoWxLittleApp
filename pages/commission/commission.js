Page({
  data:{
     currentTab: 0,
  },
  onLoad(){
       
    var self = this;
    
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
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