//calc.js
//获取应用实例
let animationShowHeight = 300;
let questionIndex = 1;
let cost = 0;
Page({
  data: {
    animationData: "",
    text: "This is page data.",
    param1: "1",
    param2: "2",
    param3: "0",
    paramresult: "0",
    sign1: "+",
    sign2: "+",
    focus: "false",
    resultedit: "",
    inputcursor: "",
    numbercount: " 1/30 ",
    resultshowView: false,
    resultwrongView: true,
    rightcount: "0",
    wrongcount: "0",
    seconds: 0,
    time: '00:00:00',
    cost: 0,
    numberData: [{ "id": "1", "number": "1" },
      { "id": "2", "number": "2" },
      { "id": "3", "number": "3" },
      { "id": "4", "number": "4" },
      { "id": "5", "number": "5" },
      { "id": "6", "number": "6" },
      { "id": "7", "number": "7" },
      { "id": "8", "number": "8" },
      { "id": "9", "number": "9" },
      { "id": "0", "number": "0" }]
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    timing(this);
    charging(this);
    questionIndex = 1;
    cost = 0;
  },
  onReady: function () {
    // Do something when page ready.
  },
  clickRecord: function (e) {

  },
  clickSubmit: function (e) {
    var that = this;
    that.data.numberData.sort(function () { return Math.random() > 0.5 ? -1 : 1; }); 
    var tempNumberAr = that.data.numberData;
    console.log(that.data.numberData);
    var value = that.data.resultedit;
    var answer = that.data.paramresult;
    var rights = that.data.rightcount;
    var wrongs = that.data.wrongcount;

    if (value == answer) {
      rights++;
      that.setData({
        resultshowView: true,
        resultwrongView: true,
        resultedit: "",
        rightcount: rights,
        numberData: tempNumberAr
      }) 
      that.showModal();
    }
    else {
      wrongs++;
      that.setData({
        resultshowView: false,
        resultwrongView:false,
        resultedit: "",
        wrongcount: wrongs,
        numberData: tempNumberAr
      })
      that.hideModal();
    }
    that.generateQuestion();
    if(questionIndex >= 30)
    {
      var urlstr = '../finish/finish?time='+that.data.seconds+'&rightcount='+that.data.rightcount+'&wrongcount='+that.data.wrongcount;
      //var urlstr = "../finish/finish?time=123";
      wx.redirectTo({
        url: urlstr
      })
    }
    that.refreshcount();
    that.generateQuestion();
  },
  refreshcount : function() {
      questionIndex++;
      var value = questionIndex + "/" + 30;
      this.setData({
        numbercount: value
      })
  },

  showModal: function () {
    // 显示遮罩层  
    
  },
  hideModal: function () {
    // 隐藏遮罩层  
    
  },

  clickButton: function (e) {
    //打印所有关于点击对象的信息
    var value = e.currentTarget.id;
    var that = this;
    if (e.currentTarget.id == 'back') {
      var tempvalue = that.data.resultedit;
      var length = tempvalue.length - 1;
      tempvalue = tempvalue.slice(0, length);
      value = tempvalue;
      this.setData({
        focus: true,
        resultedit: value,
      })
      return;
    }

    var tempvalue = that.data.resultedit + value;
    value = tempvalue;
    this.setData({
      focus: true,
      resultedit: value
    })
    console.log(e);
  },
  bindKeyInput: function (e) {
    var that = this;
    that.data.inputcursor = e.detail.cursor;
    this.setData({
      resultedit: e.detail.value
    });
  },
  generateQuestion: function() {
    var judge1 = getRandom(0, 3);
    var judge2 = getRandom(0, 1);
    var result = 1;
    var tempsign1 = "";
    var tempsign2 = "";
    var temp1, temp2, temp3;
    if (judge1 == 3) {
      // %
      result = getRandom(0,10);
      temp2 = getRandom(1,10);
      temp1 = temp2*result;
      tempsign1 = "÷";
      tempsign2 = "";  
      temp3 = "";
    }
    else if(judge1 == 2)
    {
       //*
      temp1 = getRandom(0, 100);
      temp2 = getRandom(0, 100);
      temp3 = getRandom(0,5);
      result = (temp1+temp2)*temp3;
      tempsign1 = "+";
      tempsign2 = "×";
      temp1 = '('+temp1;
      temp2 = temp2+')';
    }
    else if(judge1 == 1)
    {
      //+
      temp1 = getRandom(0,1000);
      temp2 = getRandom(0,1000-temp1);
      tempsign1 = "+";
      if (judge2 == 1) {
        //+
        temp3 = getRandom(0,1000-temp1-temp2);
        tempsign2 = "+";
        result = temp1 + temp2 + temp3;

      }
      else {
        //-
        temp3 = getRandom(0,temp1+temp2);
        tempsign2 = "-";
        result = temp1 + temp2 - temp3;
      }
    }
    else if(judge1 == 0)
    {
      //-
      temp1 = getRandom(0,1000);
      temp2 = getRandom(0,temp1);
      tempsign1 = "-";
      if (judge2 == 1) {
        //+
        temp3 = getRandom(0, 1000 - temp1 + temp2);
        tempsign2 = "+";
        result = temp1 - temp2 + temp3;
      }
      else {
        //-
        temp3 = getRandom(0, temp1 - temp2);
        tempsign2 = "-";
        result = temp1 - temp2 - temp3;
      }
    }

    this.setData({
      param1: temp1,
      param2: temp2,
      param3: temp3,
      paramresult: result,
      sign1: tempsign1,
      sign2: tempsign2
    })
  },

  onShow: function () {
    // Do something when page show.
    this.setData({
      text: ''
    });

    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    that.generateQuestion();
    
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

function getRandom(min, max) {
  var r = Math.random() * (max - min);
  var re = Math.round(r + min);
  re = Math.max(Math.min(re, max), min)
  return re;
}
/*
wx.startRecord({
  success: function (res) {
    console.log('录音成功' + JSON.stringify(res)); that.setData({
      voiceButtonName: '语音识别',
      voicePlayButtonName: '开始播放',
      tempFilePath: res.tempFilePath
    })
    //上传语音文件至服务器
    wx.uploadFile({
      url: 'https://你的域名/upload',
      filePath: res.tempFilePath,
      name: 'file',
      // header: {}, // 设置请求的 header
      formData: {
        'msg': 'voice'
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        // success
        console.log('begin');
        console.log(res.data);
        var json = JSON.parse(res.data);
        console.log(json.msg);
        var jsonMsg = JSON.parse(json.msg);
        console.log(jsonMsg.result);
        wx.navigateTo({
          url: '../voicePage/voicePage?voiceData=' + jsonMsg.result.join('')
        })
      },
      fail: function (err) {
        // fail
        console.log(err);
      },
      complete: function () {
        // complete
      }
    })
  },
  fail: function (res) {
    //录音失败
    that.setData({
      voiceButtonName: '语音识别'
    })
    console.log('录音失败' + JSON.stringify(res));
  }
})
setTimeout(function () {
  //结束录音
  wx.stopRecord()
}, 60000)
*/
function timing(that) {
  var seconds = that.data.seconds
  if (seconds > 21599) {
    that.setData({
      time: '6小时，不想继续了gg'
    });
    return;
  }
  setTimeout(function () {
    that.setData({
      seconds: seconds + 1
    });
    timing(that);
  }
    , 1000)
  formatSeconds(that)
}

function formatSeconds(that) {
  var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
  if (seconds < 60) {

  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
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
function charging(that) {
  if (that.data.seconds < 600) {
    cost = 1
  }
}