// dao/rankSqlMapping.js
// CRUD SQL语句
var rankSQL = {
	insert:'INSERT INTO rank(id, name, imgurl, time) VALUES(0,?,?,?)',
	update:'update rank set name=?, imgurl=?, time=? where id=?',
	delete: 'delete from rank where id=?',
	queryById: 'select * from rank where id=?',
	queryAll: 'select * from rank order by time LIMIT 10'
};
module.exports = rankSQL;
