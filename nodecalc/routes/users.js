var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var querystring = require('querystring');

var router = express.Router();

var rankDao = require('../dao/rankDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//http://localhost:3000/users/rankadd?name=xyz&imgurl=18&time=111
router.get('/rankadd',function(req, res, next) {
    rankDao.add(req, res);
});

router.post('/rankadd', function(req, res, next) {
    console.log(req.body);
    //console.log(res);
    //var param = req.body;
    // 建立连接，向表中插入值
    // 'INSERT INTO rank(id, name, imgurl, time) VALUES(0,?,?)',
    //console.log("post msg name=" + decodeURI(param.name)+ "    url="+decodeURI(param.imgurl) + "    time=" + decodeURI(param.time));

    rankDao.add(req, res);
    //console.log("finish rankdao.");
    //res.send(req.body);
    //console.log(req.body);
});

router.get('/getopenid',function(req, res, next) {
    res.send('respond getopenid with a resource');
    console.log("get getOpenid");
    //console.log(req.body);
});

router.post('/getopenid',function(req, res, next) {
    //console.log("post getOpenid");
    //console.log(req.body);
    //data = querystring.stringify({appid:"wxffd511ef38bd8409",secret:"f6e163f2ec495defec26c8c092882230",
    //    js_code:req.body.code});
    var urlpath = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxffd511ef38bd8409&secret=f6e163f2ec495defec26c8c092882230&js_code=' + req.body.code;

    var body = '';
    var buf_list = [];
	var len=0;
    https.get(urlpath, function(resOpen){
        console.log('status code: ' + resOpen.statusCode);
        console.log('headers: ' + resOpen.headers);
        if (resOpen.body) {
            console.log(resOpen.body.openid);
            //能正确解析 json 格式的post参数
            //res.send({"status": "success", "name": req.body.data.name, "age": req.body.data.age});
        }
        else
        {
            resOpen.on('data', function(data){
                console.log(data);
                buf_list.push(data);
    		    len += data.length;
    	    });
            resOpen.on("end", function(){
    		    body = Buffer.concat(buf_list, len).toString();
                console.log(body);
                var jsonStr = JSON.parse(body);
                console.log(jsonStr.session_key);
                console.log(jsonStr.expires_in);
                console.log(jsonStr.openid);
                res.json(jsonStr);
                //res.send(jsonStr.openid);
                //var
            });
        }
    }).on('error', function(err){
        console.error(err);
    });
});

router.get('/queryAll', function(req, res, next) {
    rankDao.queryAll(req, res, next);
    //console.log(res);
});

module.exports = router;
