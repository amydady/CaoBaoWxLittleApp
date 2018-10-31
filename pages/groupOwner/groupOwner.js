var app = getApp();
Page({

       /**
        * 页面的初始数据
        */
       data: {
              addressInfo: {},
              isModify: false,
              hasAddress: false,
              shopName:'',
              name:'',
              mobile: '',
              idCardFront: '',
              idCardBack: '',
       },

       /**
        * 生命周期函数--监听页面加载
        */
       onLoad: function(options) {

       },

       /**
        * 生命周期函数--监听页面加载
        */
       onShow: function(options) {
              var self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/tuan/getById?id=" + app.globalData.openID, //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "GET",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('groupOwner', res);
                 
                            if (res.data.data.length != 0){
                                   self.setData({
                                          shopName: res.data.data[0].name,
                                          name: res.data.data[0].tuanZhangName,
                                          mobile: res.data.data[0].mobile,
                                          addressInfo: {
                                                 provinceName: res.data.data[0].addressInfo.province,
                                                 cityName: res.data.data[0].addressInfo.city,
                                                 countyName: res.data.data[0].addressInfo.area,
                                                 detailInfo: res.data.data[0].addressInfo.detailInfo,
                                          },
                                          hasAddress:true,
                                          isModify:true,
                                          idCardFront: res.data.data[0].idCardImgDataFront,
                                          idCardBack: res.data.data[0].idCardImgDataBack,
                                   })
                            }
                     },
              })
       },

       chooseAddress() {
              wx.chooseAddress({
                     success: (res) => {
                            this.setData({
                                   addressInfo: res,
                                   hasAddress: true
                            })
                     },
                     fail: function (err) {
                            console.log(err)
                     }
              })
       },

       //添加Banner  
       chooseFront: function() {
              var that = this;
              wx.chooseImage({
                     count: 1, //最多可以选择的图片总数  
                     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                     success: function(res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                            var tempFilePaths = res.tempFilePaths;
                            //启动上传等待中...  
                            wx.showToast({
                                   title: '正在上传...',
                                   icon: 'loading',
                                   mask: true,
                                   duration: 10000
                            })
                            var uploadImgCount = 0;

                            wx.uploadFile({
                                   url: app.globalData.serverUrl + '/rest/littlecat/caobao/tuan/uploadIdCardFrontImg/' + app.globalData.openID,
                                   filePath: tempFilePaths[0],
                                   name: 'idCardFrontImg',
                                   formData: {
                                          'imgIndex': 0
                                   },
                                   header: {
                                          "Content-Type": "multipart/form-data"
                                   },
                                   success: function(res) {
                                          var data = JSON.parse(res.data);
                                          console.log("uploadFront",res);
                                          that.setData({
                                                 idCardFront: data.data[0]
                                          });
                                          wx.hideToast();
                                   },
                                   fail: function(res) {
                                          wx.hideToast();
                                          wx.showModal({
                                                 title: '错误提示',
                                                 content: '上传图片失败',
                                                 showCancel: false,
                                                 success: function(res) {}
                                          })
                                   }
                            });

                     }
              });
       },

       //添加Banner  
       chooseBack: function () {
              var that = this;
              wx.chooseImage({
                     count: 1, //最多可以选择的图片总数  
                     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                     success: function (res) {
                            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                            var tempFilePaths = res.tempFilePaths;
                            //启动上传等待中...  
                            wx.showToast({
                                   title: '正在上传...',
                                   icon: 'loading',
                                   mask: true,
                                   duration: 10000
                            })
                            var uploadImgCount = 0;

                            wx.uploadFile({
                                   url: app.globalData.serverUrl + '/rest/littlecat/caobao/tuan/uploadIdCardBackImg/' + app.globalData.openID,
                                   filePath: tempFilePaths[0],
                                   name: 'idCardBackImg',
                                   formData: {
                                          'imgIndex': 0
                                   },
                                   header: {
                                          "Content-Type": "multipart/form-data"
                                   },
                                   success: function (res) {
                                          var data = JSON.parse(res.data);
                                          console.log("uploadBack", res);
                                          that.setData({
                                                 idCardBack: data.data[0]
                                          });
                                          wx.hideToast();
                                   },
                                   fail: function (res) {
                                          wx.hideToast();
                                          wx.showModal({
                                                 title: '错误提示',
                                                 content: '上传图片失败',
                                                 showCancel: false,
                                                 success: function (res) { }
                                          })
                                   }
                            });

                     }
              });
       },

       formSubmit(e) {
              var self = this;
              var url = "add";
        
              if (self.data.isModify){
                     url = "modify"
              }
              const value = e.detail.value;
              if (value.shopName && value.name && value.mobile && self.data.hasAddress) {
                     wx.request({
                            url: app.globalData.serverUrl + "/rest/littlecat/caobao/tuan/" + url, //给函数传递服务器地址参数
                            data: {
                                   id: app.globalData.openID,
                                   tuanZhangName: value.name,
                                   name: value.shopName,
                                   mobile: value.mobile,
                                   addressInfo:{
                                          province: self.data.addressInfo.provinceName,
                                          city: self.data.addressInfo.cityName,
                                          area: self.data.addressInfo.countyName,
                                          detailInfo: self.data.addressInfo.detailInfo,
                                   }

                            }, //给服务器传递数据，本次请求不需要数据，可以不填
                            method: "POST",
                            header: {
                                   'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                            },
                            success: function(res) {
                                   console.log('groupOwner', res);
                                   //pay weixin
                                   self.setData({
                                          isModify: true
                                   });
                            },
                     })
              } else {
                     wx.showModal({
                            title: '提示',
                            content: '请填写完整资料',
                            showCancel: false
                     })
              }
       }
})