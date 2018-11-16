import md5 from '../../utils/md5.js';
var app = getApp()
Page({
       data: {
              currentTab: 0,
              scrollTop: 0,
              page: 0,
              ordersData: [],
       },
       onLoad: function(options) {
              var current = options.id;
              this.data.currentTab = current ? current : 0
              var systemInfo = wx.getSystemInfoSync()
              this.setData({
                     currentTab: this.data.currentTab,
                     windowHeight: systemInfo.windowHeight
              })
       },
       onShow: function() {

              this.setCurrentData();
       },
       setCurrentData: function() {
              var state = {};
              if (this.data.currentTab == 0) {
                     state = {};
              } else if (this.data.currentTab == 1) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "daifukuan"
                                   }]
                            }
                     }
              } else if (this.data.currentTab == 2) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "daichengtuan"
                                   }]
                            }
                     }
              } else if (this.data.currentTab == 3) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "daifahuo"
                                   }]
                            }
                     }
              } else if (this.data.currentTab == 4) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "daiqianshou"
                                   }]
                            }
                     }
              } else if (this.data.currentTab == 5) {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "equal",
                                          "value": "yishouhuo"
                                   }]
                            }
                     }
              } else {
                     state = {
                            "condition": {
                                   "logicType": "and",
                                   "condItems": [{
                                          "fieldName": "state",
                                          "opType": "in",
                                          "value": "'tuikuanzhong','yituikuan','tuangoujiesantuikuan'"
                                   }]
                            }
                     }
              }
              var self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/getList", //给函数传递服务器地址参数
                     data: state, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "POST",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('order', res);
                            self.setData({
                                   ordersData: res.data.data
                            })
                     },
              })

       },
       toGroupDetail: function(e) {
              var id = e.currentTarget.dataset.id;
              app.redirect('group/detail', 'id=' + id)
       },

       toPay: function(e) {
              let orderId = e.currentTarget.dataset.id;
              let price = e.currentTarget.dataset.price;
              // this.paySuccess(orderId);
              return;
              let self = this;
              var appid = 'wx59e6873e9161c795'; //appid  
              var body = '味品源-超市'; //商户名
              var mch_id = '1502422811'; //商户号  
              var nonce_str = this.randomString(); //随机字符串，不长于32位。  
              var notify_url = 'aaa'; //通知地址
              var spbill_create_ip = '47.100.218.102'; //ip
              var total_fee = Math.round(price * 100);
              var trade_type = "JSAPI";
              var key = 'q9qShwkPzNTKlU5vJTvMb3DA6OYcZzD5';
              var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + app.globalData.openID + '&out_trade_no=' + orderId + '&spbill_create_ip=' + spbill_create_ip + '&total_fee=' + total_fee + '&trade_type=' + trade_type + '&key=' + key
              var sign = md5(unifiedPayment).toUpperCase();
              var formData = "<xml>"
              formData += "<appid>" + appid + "</appid>"
              formData += "<body>" + body + "</body>"
              formData += "<mch_id>" + mch_id + "</mch_id>"
              formData += "<nonce_str>" + nonce_str + "</nonce_str>"
              formData += "<notify_url>" + notify_url + "</notify_url>"
              formData += "<openid>" + app.globalData.openID + "</openid>"
              formData += "<out_trade_no>" + orderId + "</out_trade_no>"
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
                     success: function (res) {
                            console.log('统一下单', res.data)

                            var result_code = self.getXMLNodeValue('result_code', res.data.toString("utf-8"))
                            var resultCode = result_code.split('[')[2].split(']')[0]
                            if (resultCode == 'FAIL') {
                                   var err_code_des = self.getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
                                   var errDes = err_code_des.split('[')[2].split(']')[0]
                                   wx.navigateBack({
                                          delta: 1, // 回退前 delta(默认为1) 页面
                                          success: function (res) {
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
                                   var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + tmp1[0] + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key
                                   var sign = md5(stringSignTemp).toUpperCase()

                                   var param = {
                                          "id": orderId,
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
       randomString: function () {
              var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
              var maxPos = chars.length;
              var pwd = '';
              for (var i = 0; i < 32; i++) {
                     pwd += chars.charAt(Math.floor(Math.random() * maxPos));
              }
              return pwd;
       },
       /* 获取prepay_id */
       getXMLNodeValue: function (node_name, xml) {
              return xml.split("<" + node_name + ">")[1].split("</" + node_name + ">")[0];
       },

       /* 时间戳产生函数   */
       createTimeStamp: function () {
              return parseInt(new Date().getTime() / 1000) + ''
       },
       /* 支付   */
       pay: function (param) {
              let self = this;
              wx.requestPayment({
                     timeStamp: param.timeStamp,
                     nonceStr: param.nonceStr,
                     package: param.package,
                     signType: param.signType,
                     paySign: param.paySign,
                     success: function (res) {
                            // success
                            console.log('支付成功', res)
                            self.paySuccess(param.id);
                            wx.navigateBack({
                                   delta: 1, // 回退前 delta(默认为1) 页面
                                   success: function (res) {
                                          wx.showToast({
                                                 title: '支付成功',
                                                 icon: 'success',
                                                 duration: 2000
                                          })
                                   },
                                   fail: function () {
                                          // fail
                                   },
                                   complete: function () {
                                          // complete
                                   }
                            })
                     },
                     fail: function () {
                            // fail
                            console.log("支付失败")
                     },
                     complete: function () {
                            // complete
                            console.log("pay complete")
                     }
              })
       },
       paySuccess(orderId) {
              let self = this;
              wx.request({
                     url: app.globalData.serverUrl + "/rest/littlecat/caobao/order/payOrder/" + orderId, //给函数传递服务器地址参数
                     data: {

                     }, //给服务器传递数据，本次请求不需要数据，可以不填
                     method: "PUT",
                     header: {
                            'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
                     },
                     success: function(res) {
                            console.log('pay-success', res);
                            self.onShow();
                     },
              })
       },
       confirmReceipt: function(e) {
              var self = this;
              var id = e.currentTarget.dataset.id;
              wx.showModal({
                     content: '是否确认收货？',
                     success: function(res) {
                            if (res.confirm) {
                                   app.request.wxRequest({
                                          url: 'confirm-receipt',
                                          data: {
                                                 oid: id
                                          },
                                          success: function(res) {
                                                 self.data.ordersData = []
                                                 self.data.page = 0
                                                 self.setCurrentData()
                                          }
                                   })
                            }
                     }
              })
       },
       showOrderDetail: function(e) {
              var id = e.currentTarget.dataset.id;
              app.redirect('orders/detail', 'oid=' + id)
       },
       showGoodsDetial: function(e) {
              var id = e.currentTarget.dataset.id;
              app.redirect('goods/detail', 'gid=' + id);
       },
       // 滑动切换tab 
       bindChange: function(e) {
              this.data.page = 0
              this.data.ordersData = []
              this.data.currentTab = e.detail.current
              this.setCurrentData()
              this.setData({
                     ordersList: [],
                     currentTab: this.data.currentTab
              })
       },
       // 点击tab切换 
       swichNav: function(e) {
              if (this.data.currentTab == e.currentTarget.dataset.current) return;

              this.data.currentTab = e.currentTarget.dataset.current
              this.setData({
                     currentTab: this.data.currentTab
              })
              this.setCurrentData();
       },
       scrolltolower: function() {
              ++this.data.page
              this.setCurrentData()
       }
})