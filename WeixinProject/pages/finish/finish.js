// pages/finish/finish.js
var app = getApp();
var Util = require('../../utils/util.js');
var timedata="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:"",
    timedisplay:"",
    timecost: "",
    rightcount: "0",
    wrongcount: "0",
    userInfo: {},
    nameedit: "",
    listData: [{ "id": "01", "imgurl": "01", "name": "text1", "time": "type1" },
    { "id": "01", "imgurl": "02", "name": "text2", "time": "type2" },
    { "id": "01", "imgurl": "03", "name": "text3", "time": "type3" },
    { "id": "01", "imgurl": "04", "name": "text4", "time": "type4" },
    { "id": "01", "imgurl": "05", "name": "text5", "time": "type5" },
    { "id": "01", "imgurl": "06", "name": "text6", "time": "type6" },
    { "id": "01", "imgurl": "07", "name": "text7", "time": "type7" },
    { "id": "01", "imgurl": "08", "name": "text7", "time": "type7" },
    { "id": "01", "imgurl": "09", "name": "text7", "time": "type7" },
    { "id": "01", "imgurl": "10", "name": "text7", "time": "type7" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    console.log(options.time);
    formatSeconds(options.time, that);
    that.setData({
      timecost:options.time,
      timedisplay: that.data.time,
      rightcount: options.rightcount,
      wrongcount: options.wrongcount
    });
    console.log(that.data.timecost);
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      var nickName = userInfo.nickName;
      that.setData({
        userInfo: userInfo,
        nameedit: nickName
      })
    })    
    wx.request({
      url: "https://www.haifan.pub/users/queryAll",
      data: {
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log("good query.");
        console.log(res);
       
        for (var i = 0; i<res.data.length; i++) {
          console.log(res.data[i].time);
          formatSeconds(res.data[i].time, that);
          var formattime = that.data.time;
          res.data[i].time = formattime; // 第一个,第二个
          console.log(formattime);
        } 
        that.setData({
          listData: res.data
        })
        console.log(that.data.listData);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  bindKeyInput: function (e) {
    var that = this;
    that.data.inputcursor = e.detail.cursor;
    this.setData({
      nameedit: e.detail.value
    });
  },
  clickAgain: function (e) {
    //打印所有关于点击对象的信息
    var value = e.currentTarget.id;
    wx.redirectTo({
      url: '../index/index'
    })
    console.log(e);
  },
  submitrank: function (e) {
    //提交排名数据
    var that = this;
    var openid = "";
    if(that.data.wrongcount == 0)
    {
      wx.login({
        success: function (res_login) {
          if (res_login.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (res_user) {
                console.log("start getopenid.");
                //console.log(res_login.code);
                wx.request({
                  url: "https://www.haifan.pub/users/getOpenid",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: Util.json2Form({
                    code: res_login.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  }),
                  complete: function (res) {
                    if (res == null || res.data == null) {
                      console.error('网络请求失败');
                      return;
                    }
                    else
                    {
                      console.log(res);
                      openid = res.data.openid;
                      console.log(openid);


                      var value = that.data.nameedit;
                      console.log(value);
                      console.log(openid);
                      wx.request({
                        url: "https://www.haifan.pub/users/rankadd",
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        data: Util.json2Form({
                          name: that.data.nameedit,
                          imgurl: that.data.userInfo.avatarUrl,
                          time: that.data.timecost,
                          oid: openid
                        }),
                        complete: function (res) {
                          wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 1500
                          });
                          if (res == null || res.data == null) {
                            console.error('网络请求失败');
                            return;
                          }
                        }
                      }) 
                      


                    }
                  }
                });//wx.request
              }
            })
          }
        }
      })

      
       
    }
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function formatSeconds(second, that) {
  var mins = 0, hours = 0, seconds = second, time = ''
  if (second < 60) {

  } else if (second < 3600) {
    mins = parseInt(second / 60)
    seconds = second % 60
  } else {
    mins = parseInt(second / 60)
    seconds = second % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  }
  that.setData({
    time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds)
  });
}

function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}