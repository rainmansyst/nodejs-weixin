// dao/rankDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./rankSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	add: function (req, res) {
        console.log("dao start");
        //console.log(req.body);
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;// || req.params;
			// 建立连接，向表中插入值
			// 'INSERT INTO rank(id, name, imgurl, time) VALUES(0,?,?)',
            //console.log("name=" + decodeURI(param.name)+ "    url="+decodeURI(param.imgurl) + "    time=" + decodeURI(param.time) + "   oid=" + decodeURI(param.oid));
            //console.log($sql.insert);
            //connection.query($sql.insert, [param.name, param.imgurl, param.time], function(err, result) {
            connection.query('select * from rank where openid = ?' ,[decodeURI(param.oid)], function(err,result) {
				var sqlSentence;
				var sqlParam;
				var bChange = false;
				console.log(result);
				if(result)
				{
					var getResult = JSON.stringify(result);
					//jsonWrite(getResult, result);
					if (getResult.openid == decodeURI(param.oid))
					{
						if(getResult.time > decodeURI(param.time))
						{
							bChange = true;
							sqlSentence = 'update rank set name=?, imgurl=?, time=? where id=?';
							sqlParam = [decodeURI(param.name), decodeURI(param.imgurl), decodeURI(param.time), decodeURI(param.oid)];
							console.log(sqlSentence);
							console.log(sqlParam);
						}
					}
					else {
						bChange = true;
						sqlSentence = 'INSERT INTO rank(name, imgurl, time, openid) VALUES(?,?,?,?)';
						sqlParam = [decodeURI(param.name), decodeURI(param.imgurl), decodeURI(param.time), decodeURI(param.oid)];
						console.log(sqlSentence);
						console.log(sqlParam);
					}
				}
				if(bChange)
				{
					console.log(sqlSentence);
					console.log(sqlParam);
					pool.getConnection(function(err, connectionChange) {
						connectionChange.query(sqlSentence, sqlParam, function(err,result) {
					    	if(result) {
								result = {
									code: 200,
									msg:'增加成功'
								};
				                console.log("insert ok.");
							}
							// 以json形式，把操作结果返回给前台页面
							jsonWrite(res, result);
							// 释放连接
							connectionChange.release();
						});
					});
				}
				connection.release();
			});
		});
	},

    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
};
