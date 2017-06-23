//index.js
//获取应用实例 
var app = getApp();
var Util = require('../../utils/util.js');

Page({
  data: {
    time:"",
    animationData: "",
    text: "This is page data.",
    param1: "1",
    param2: "2",
    param3: "0",
    sign: "+",
    focus: "false",
    resultedit: "",
    rankdata: [],
    userInfo: {},
    listData: []
  },


  onLoad: function (options) {
    // Do some initialize when page load.
    var that = this;
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    wx.request({
      url: "https://www.haifan.pub/users/queryAll",
      data: {
      },
      header: {
         "Content-Type":"application/json"
      },
      success: function (res) {
        console.log("good query.");
        console.log(res);
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i].time);
          formatSeconds(res.data[i].time,that);
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
  onReady: function () {
    // Do something when page ready.
  },
  
  clickJoin: function (e) {
    //打印所有关于点击对象的信息
    var value = e.currentTarget.id;
    wx.navigateTo({
      url: '../calc/calc'
    })
    console.log(e);
  },

  onShow: function () {
    // Do something when page show.
    
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  // Event handler.
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    })
  },
  customData: {
    hi: 'MINA'
  },
})

function formatSeconds(second,that) {
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