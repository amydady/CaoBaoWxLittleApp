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
              orders: []
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
              let self = this;
              let orders = this.data.orders;
              let payOders = [];
              for (let i = 0; i < orders.length; i++) {
                     payOders.push({
                            buyType: orders[i].buyType,
                            resId: orders[i].resId,
                            goodsId: orders[i].goodsId,
                            price: orders[i].price,
                            goodsNum: orders[i].num,
                            shareTuanZhangId: orders[i].shareId,
                     });
              }
              if (this.check()) {
                     wx.request({
                            url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/create", //给函数传递服务器地址参数
                            data: {
                                   "orderMO": {
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
                                   console.log('orders', res);
                                   self.setData({
                                          paySn: res.data.data[0]
                                   })
                                   self.payToWx();
                                   // self.paySuccess();
                                
                            },
                     })
              }
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

       payToWx() {
              let self = this;
              var appid = 'wx59e6873e9161c795'; //appid  
              var body = '味品源-超市'; //商户名
              var mch_id = '1502422811'; //商户号  
              var nonce_str = this.randomString(); //随机字符串，不长于32位。  
              var notify_url = 'aaa'; //通知地址
              var spbill_create_ip = '47.100.218.102'; //ip
              var total_fee = Math.round(this.data.total * 100);
              var trade_type = "JSAPI";
              var key = 'q9qShwkPzNTKlU5vJTvMb3DA6OYcZzD5';
              var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + app.globalData.openID + '&out_trade_no=' + this.data.paySn + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
              var sign = md5(unifiedPayment).toUpperCase();
              var formData = "<xml>"
              formData += "<appid>" + appid + "</appid>"
              formData += "<body>" + body + "</body>"
              formData += "<mch_id>" + mch_id + "</mch_id>"
              formData += "<nonce_str>" + nonce_str + "</nonce_str>"
              formData += "<notify_url>" + notify_url + "</notify_url>"
              formData += "<openid>" + app.globalData.openID + "</openid>"
              formData += "<out_trade_no>" + this.data.paySn + "</out_trade_no>"
              formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
              formData += "<total_fee>" + total_fee + "</total_fee>"
              formData += "<trade_type>" + trade_type + "</trade_type>"
              formData += "<sign>" + sign + "</sign>"
              formData += "</xml>"
              //统一支付
              wx.request({
                     url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
                     method: 'POST',
                     head: 'application/x-www-form-urlencoded',
                     data: formData, // 设置请求的 header
                     success: function(res) {
                            console.log('统一下单', res.data)

                            var result_code = self.getXMLNodeValue('result_code', res.data.toString("utf-8"))
                            var resultCode = result_code.split('[')[2].split(']')[0]
                            if (resultCode == 'FAIL') {
                                   var err_code_des = self.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
                                   var errDes = err_code_des.split('[')[2].split(']')[0]
                                   wx.navigateBack({
                                          delta: 1, // 回退前 delta(默认为1) 页面
                                          success: function(res) {
                                                 wx.showToast({
                                                        title: errDes,
                                                        icon: 'success',
                                                        duration: 2000
                                                 })
                                          },

                                   })
                            } else {
                                   //发起支付
                                   var prepay_id = self.getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
                                   var tmp = prepay_id.split('[')
                                   var tmp1 = tmp[2].split(']')
                                   //签名  
                                   var key = 'q9qShwkPzNTKlU5vJTvMb3DA6OYcZzD5';
                                   var appId = 'wx59e6873e9161c795';
                                   var timeStamp = self.createTimeStamp();
                                   var nonceStr = self.randomString();
                                   var stringSignTemp = "appId=" + appId+"&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key
                                   var sign = md5(stringSignTemp).toUpperCase()
                               
                                   var param = {
                                          "timeStamp": timeStamp,
                                          "package": 'prepay_id=' + tmp1[0],
                                          "paySign": sign,
                                          "signType": "MD5",
                                          "nonceStr": nonceStr
                                   }
                                   self.pay(param)
                            }



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
       pay: function(param) {
              let self = this;
              wx.requestPayment({
                     timeStamp: param.timeStamp,
                     nonceStr: param.nonceStr,
                     package: param.package,
                     signType: param.signType,
                     paySign: param.paySign,
                     success: function(res) {
                            // success
                            console.log('支付成功',res)
                            self.paySuccess();
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
                     },
                     complete: function() {
                            // complete
                            console.log("pay complete")
                     }
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
              if (this.data.hasAddress) {
                     return true;
              }
              wx.showModal({
                     title: '提示',
                     content: '未添加收货地址',
                     text: 'center',
                     complete() {
                            return false;
                     }
              })
       }
})