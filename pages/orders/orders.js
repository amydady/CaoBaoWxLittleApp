// var util = require('../../utils/md5.js');
import md5 from '../../utils/md5.js';
var app = getApp();
Page({
  data: {
    addressInfo: {},
    goodsAddressInfo: {},
    hasAddress: false,
    hasGoodsAddress: false,
    total: 0,
    paySn: '',
    orders: [],
    disabled: false
  },


  onShow: function() {
    let self = this;
    wx.getStorage({
      key: 'selectGoods',
      success(res) {
        self.setData({
          orders: res.data,
        })
        self.getTotalPrice()
      }
    })
    wx.getStorage({
      key: 'selectAddress',
      success(res) {
        if (res.data) {
          self.setData({
            goodsAddressInfo: res.data,
            hasGoodsAddress: true
          })
        }
      }
    })
  },
  onLoad(options) {

  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.data.total = total;
    this.setData({
      total: total
    })
  },

  toPay() {
    if (this.data.disabled) {
      return;
    }
    let self = this;
    let orders = this.data.orders;
    let payOders = [];
    let shareTuanZhangId = app.globalData.shareID;
    for (let i = 0; i < orders.length; i++) {
      payOders.push({
        buyType: orders[i].buyType,
        resId: orders[i].resId,
        goodsId: orders[i].goodsId,
        price: orders[i].price,
        goodsNum: orders[i].num
      });
      if (shareTuanZhangId == null && orders[i].shareId != null){
        shareTuanZhangId: orders[i].shareId
      }
    }
    if (this.check()) {
      this.setData({
        disabled: true
      })

      wx.showLoading({

      })
      console.log("xxxxxxxxxxxx  shareTuanZhangId  xxxxxxxxxxxxx", shareTuanZhangId)
      wx.request({
        url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/create", //给函数传递服务器地址参数
        data: {
          "orderMO": {
            "shareTuanZhangId": shareTuanZhangId,
            "terminalUserId": app.globalData.openID,
            "fee": self.data.total,
            "state": "daifukuan",
            "deliveryAddress": {
              "province": self.data.addressInfo.provinceName,
              "city": self.data.addressInfo.cityName,
              "area": self.data.addressInfo.countyName,
              "detailInfo": self.data.addressInfo.detailInfo,
            },
            "deliverySiteAddress": {
              "province": self.data.goodsAddressInfo.addressInfo.province,
              "city": self.data.goodsAddressInfo.addressInfo.city,
              "area": self.data.goodsAddressInfo.addressInfo.area,
              "detailInfo": self.data.goodsAddressInfo.addressInfo.detailInfo,
            },
            "deliveryTuanZhangId": self.data.goodsAddressInfo.id,
            "contactName": self.data.addressInfo.userName,
            "contactMobile": self.data.addressInfo.telNumber
          },
          "orderDetailMOs": payOders
        }, //给服务器传递数据，本次请求不需要数据，可以不填
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
        },
        success: function(res) {
          console.log('orders-create', res);
          if (res.data.code == 'NONE_ERROR') {
            self.setData({
              paySn: res.data.data[0].orderId
            })

            self.pay(res.data.data[0].prePayId);
          } else {
            wx.hideLoading()
          }
        },
      })
    }
  },



  deleteFromCart(ids) {
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/shoppingcart/batchdelete", //给函数传递服务器地址参数
      data: ids, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        //TO-DO 详细信息
        console.log('delete-cart', res);
      },
    })
  },


  /* 随机数 */
  randomString: function() {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 获取prepay_id */
  getXMLNodeValue: function(node_name, xml) {
    return xml.split("<" + node_name + ">")[1].split("</" + node_name + ">")[0];
  },

  /* 时间戳产生函数   */
  createTimeStamp: function() {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  /* 支付   */
  pay: function(prepay_id) {
    let self = this;
    //签名  
    var key = 'q9qShwkPzNTKlU5vJTvMb3DA6OYcZzD5';
    var appId = 'wx59e6873e9161c795';
    var timeStamp = self.createTimeStamp();
    var nonceStr = self.randomString();
    var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key
    var sign = md5(stringSignTemp).toUpperCase()

    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: 'prepay_id=' + prepay_id,
      signType: "MD5",
      paySign: sign,
      success: function(res) {
        // success
        console.log('支付成功', res)
        self.paySuccess();
        wx.hideLoading()
        self.setData({
          disabled: true
        })
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail: function() {
        // fail
        console.log("支付失败")
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/orders/index?id=1'
        })
      },
      complete: function() {
        // complete
        console.log("pay complete")
      }
    })
  },

  paySuccess() {
    let self = this;
    wx.request({
      url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/payOrder/" + self.data.paySn, //给函数传递服务器地址参数
      data: {

      }, //给服务器传递数据，本次请求不需要数据，可以不填
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success: function(res) {
        console.log('pay-success', res);

        let orders = self.data.orders;
        let ids = [];
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].isCart) {
            ids.push(orders[i].id);
          }
        }
        if (ids.length > 0) {
          self.deleteFromCart(ids);
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
      fail: function(err) {
        console.log(err)
      }
    })
  },
  chooseGoodsAddress() {
    wx.navigateTo({
      url: '/pages/goodsAddress/goodsAddress?province=' + this.data.addressInfo.provinceName + '&city=' + this.data.addressInfo.cityName + '&area=' + this.data.addressInfo.countyName
    })
  },
  check() {
    if (!this.data.hasAddress) {
      wx.showToast({
        title: '未添加收货地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.hasGoodsAddress) {
      wx.showToast({
        title: '未选择自提点',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  }
})